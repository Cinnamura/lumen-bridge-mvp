import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { roundMoney } from './payment-schedule.utils';
import { PrismaService } from '../../database/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { PaymentScheduleService } from './payment-schedule.service';

function nextPayment(schedule: any[]) {
  const pending = schedule
    .filter((s) => s.status !== 'PAID')
    .sort((a, b) => a.seq - b.seq)[0];
  return pending
    ? {
        date: pending.dueDate.toISOString(),
        amount: Math.max(
          0,
          Number(pending.amountRequired ?? 0) - Number(pending.amountPaid ?? 0),
        ),
      }
    : { date: undefined, amount: undefined };
}

function toLoanDto(loan: any, schedule: any[] = []) {
  const np = nextPayment(schedule.length ? schedule : loan.schedule ?? []);
  return {
    id: loan.id,
    applicationId: loan.applicationId,
    amount: Number(loan.amount),
    termDays: loan.termDays,
    dailyRate: Number(loan.dailyRate),
    dailyPayment: Number(loan.dailyPayment),
    totalRepayment: Number(loan.totalRepayment),
    paidAmount: Number(loan.paidAmount ?? 0),
    remainingAmount: Number(loan.remainingAmount ?? 0),
    status: loan.status,
    issuedAt: loan.issuedAt?.toISOString(),
    closedAt: loan.closedAt?.toISOString(),
    signedAt: loan.signedAt?.toISOString(),
    nextPaymentDate: np.date,
    nextPaymentAmount: np.amount,
  };
}

function toScheduleDto(s: any) {
  return {
    id: s.id,
    seq: s.seq,
    dueDate: s.dueDate.toISOString(),
    amountRequired: Number(s.amountRequired ?? 0),
    amountPaid: Number(s.amountPaid ?? 0),
    amountRemaining: Math.max(0, Number(s.amountRequired ?? 0) - Number(s.amountPaid ?? 0)),
    status: s.status,
    paidAt: s.paidAt?.toISOString(),
  };
}

@Injectable()
export class LoansService {
  private readonly logger = new Logger(LoansService.name);

  constructor(
    private prisma: PrismaService,
    private notifications: NotificationsService,
    private schedule: PaymentScheduleService,
  ) {}

  private async synchronizeSafely(loanId: string) {
    try {
      await this.schedule.synchronize(loanId);
    } catch (error) {
      this.logger.warn(`Loan schedule sync skipped for ${loanId}: ${error instanceof Error ? error.message : 'unknown error'}`);
    }
  }

  async listForUser(userId: string) {
    const loans = await this.prisma.loan.findMany({
      where: { userId },
      include: { schedule: { orderBy: { seq: 'asc' } } },
      orderBy: { createdAt: 'desc' },
    });
    await Promise.all(loans.map((loan) => this.synchronizeSafely(loan.id)));
    const syncedLoans = await this.prisma.loan.findMany({
      where: { userId },
      include: { schedule: { orderBy: { seq: 'asc' } } },
      orderBy: { createdAt: 'desc' },
    });
    const active = syncedLoans
      .filter((l) => l.status !== 'closed')
      .map((l) => toLoanDto(l, l.schedule));
    const closed = syncedLoans
      .filter((l) => l.status === 'closed')
      .map((l) => toLoanDto(l, l.schedule));
    return { active, closed };
  }

  async getForUser(userId: string, id: string) {
    await this.synchronizeSafely(id);

    const loan = await this.prisma.loan.findUnique({
      where: { id },
      include: { schedule: { orderBy: { seq: 'asc' } }, payments: true },
    });
    if (!loan) throw new NotFoundException('Займ не найден');
    if (loan.userId !== userId) throw new ForbiddenException('Нет доступа к займу');

    return {
      ...toLoanDto(loan, loan.schedule),
      schedule: loan.schedule.map(toScheduleDto),
      payments: loan.payments.map((p) => ({
        id: p.id,
        amount: Number(p.amount),
        recordedAt: p.recordedAt.toISOString(),
        note: p.note ?? undefined,
      })),
    };
  }

  /**
   * Рассчитывает сумму досрочного погашения займа на текущий момент:
   *   payoffAmount = остаток тела займа + проценты ровно за ОДИН день.
   *
   * Только тело и один день процентов — будущие строки графика и их
   * проценты полностью игнорируются. Это защищает пользователя от
   * списания процентов за ещё не прожитые дни.
   */
  async calculatePayoffAmount(
    loanId: string,
    userId: string,
  ): Promise<{
    payoffAmount: number;
    outstandingPrincipal: number;
    todayInterest: number;
    savings: number;
  }> {
    const loan = await this.prisma.loan.findUnique({ where: { id: loanId } });
    if (!loan) throw new NotFoundException('Займ не найден');
    if (loan.userId !== userId) throw new ForbiddenException('Нет доступа к займу');

    const snapshot = await this.schedule.synchronize(loanId);
    if (!snapshot) throw new NotFoundException('График платежей не найден');

    const dailyRate = Number(loan.dailyRate);
    const principal = snapshot.outstandingPrincipal ?? Number(loan.amount);

    const todayInterest = roundMoney(principal * dailyRate);
    const payoffAmount = roundMoney(principal + todayInterest);
    // Экономия = разница между полным остатком по графику и суммой досрочного погашения
    const savings = roundMoney(Math.max(0, snapshot.remainingAmount - payoffAmount));

    return { payoffAmount, outstandingPrincipal: principal, todayInterest, savings };
  }

  /** Шаг 1 подписания: генерация OTP-кода (mock) */
  async requestSignOtp(userId: string, loanId: string): Promise<{ mockCode: string }> {
    const loan = await this.prisma.loan.findUnique({ where: { id: loanId } });
    if (!loan) throw new NotFoundException('Займ не найден');
    if (loan.userId !== userId) throw new ForbiddenException('Нет доступа к займу');
    if (loan.status !== 'pending_signing')
      throw new ConflictException('Займ не ожидает подписания');

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    const code = String(Math.floor(100000 + Math.random() * 900000));
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await this.prisma.otpCode.create({
      data: { phone: user!.phone, code, purpose: 'sign_loan', loanId, expiresAt },
    });

    return { mockCode: code };
  }

  /** Шаг 2 подписания: проверка OTP, фиксация signed_at/IP/UA, создание графика */
  async sign(
    userId: string,
    loanId: string,
    code: string,
    ip?: string,
    userAgent?: string,
  ) {
    const loan = await this.prisma.loan.findUnique({ where: { id: loanId } });
    if (!loan) throw new NotFoundException('Займ не найден');
    if (loan.userId !== userId) throw new ForbiddenException('Нет доступа к займу');
    if (loan.status !== 'pending_signing')
      throw new ConflictException('Займ уже подписан');

    const otp = await this.prisma.otpCode.findFirst({
      where: {
        loanId,
        code,
        purpose: 'sign_loan',
        used: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });
    if (!otp) throw new UnauthorizedException('Неверный или просроченный код');

    await this.prisma.otpCode.update({ where: { id: otp.id }, data: { used: true } });

    const issuedAt = new Date();
    await this.prisma.loan.update({
      where: { id: loanId },
      data: {
        status: 'active',
        signedAt: issuedAt,
        signedIp: ip ?? null,
        signedUserAgent: userAgent ?? null,
        issuedAt,
        // При активации весь долг ещё не выплачен
        paidAmount: 0,
        remainingAmount: loan.totalRepayment,
      },
    });

    await this.schedule.build(loanId);

    await this.notifications.create({
      userId,
      type: 'loan_signed',
      title: 'Займ подписан',
      body: 'Договор подписан. Средства зачислены, сформирован график платежей.',
      relatedId: loanId,
    });

    return this.getForUser(userId, loanId);
  }
}
