import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { normalizeScheduleRows, roundMoney, splitAmount } from './payment-schedule.utils';

function addDays(base: Date, days: number): Date {
  const d = new Date(base);
  d.setUTCDate(d.getUTCDate() + days);
  return d;
}

@Injectable()
export class PaymentScheduleService {
  constructor(
    private prisma: PrismaService,
    private notifications: NotificationsService,
  ) {}

  /** Создаёт график ежедневных платежей после подписания займа (одной транзакцией). */
  async build(loanId: string) {
    const loan = await this.prisma.loan.findUnique({ where: { id: loanId } });
    if (!loan) return;

    const issued = loan.issuedAt ?? new Date();
    const amounts = splitAmount(Number(loan.totalRepayment), loan.termDays);

    const rows: Prisma.PaymentScheduleCreateManyInput[] = amounts.map((amount, index) => ({
      loanId,
      seq: index + 1,
      dueDate: addDays(issued, index + 1),
      amount: new Prisma.Decimal(amount),
      status: 'pending',
    }));

    await this.prisma.paymentSchedule.createMany({ data: rows });
  }

  /**
   * Полностью синхронизирует график с фактически уплаченными деньгами.
   * После пересчёта сумма всех непогашенных строк всегда равна remainingAmount.
   */
  async applyPayment(loanId: string): Promise<boolean> {
    const loan = await this.prisma.loan.findUnique({
      where: { id: loanId },
      include: { schedule: { orderBy: { seq: 'asc' } } },
    });
    if (!loan) return false;

    const agg = await this.prisma.payment.aggregate({
      where: { loanId, status: 'success' },
      _sum: { amount: true },
    });
    const totalPaid = Number(agg._sum.amount ?? 0);

    const normalized = normalizeScheduleRows({
      rows: loan.schedule.map((row) => ({
        id: row.id,
        seq: row.seq,
        dueDate: row.dueDate,
        amount: Number(row.amount),
        status: row.status as 'pending' | 'paid' | 'overdue',
        paidAt: row.paidAt,
      })),
      totalRepayment: Number(loan.totalRepayment),
      totalPaid,
      now: new Date(),
    });

    await this.prisma.$transaction(
      normalized.rows.map((row) =>
        this.prisma.paymentSchedule.update({
          where: { id: row.id },
          data: {
            amount: new Prisma.Decimal(row.amount),
            status: row.status,
            paidAt: row.paidAt,
          },
        }),
      ),
    );

    return normalized.allPaid;
  }

  /**
   * Единый источник истины для баланса займа.
   * Пересчитывает paidAmount как сумму успешных платежей и remainingAmount
   * как остаток к возврату (не меньше нуля). При нулевом остатке —
   * автоматически закрывает займ и уведомляет клиента.
   * Возвращает актуальные значения баланса и флаг закрытия.
   */
  async recalcBalance(loanId: string): Promise<{ paidAmount: number; remainingAmount: number; closed: boolean }> {
    const loan = await this.prisma.loan.findUnique({ where: { id: loanId } });
    if (!loan) return { paidAmount: 0, remainingAmount: 0, closed: false };

    const agg = await this.prisma.payment.aggregate({
      where: { loanId, status: 'success' },
      _sum: { amount: true },
    });

    const total = Number(loan.totalRepayment);
    const paid = roundMoney(Number(agg._sum.amount ?? 0));
    const remaining = roundMoney(Math.max(0, total - paid));
    const shouldClose = remaining === 0 && loan.status !== 'closed' && loan.status !== 'pending_signing';

    await this.prisma.loan.update({
      where: { id: loanId },
      data: {
        paidAmount: new Prisma.Decimal(paid),
        remainingAmount: new Prisma.Decimal(remaining),
        ...(shouldClose ? { status: 'closed', closedAt: new Date() } : {}),
      },
    });

    if (shouldClose) {
      await this.notifications.create({
        userId: loan.userId,
        type: 'loan_closed',
        title: 'Займ закрыт',
        body: 'Задолженность полностью погашена. Займ переведён в архив.',
        relatedId: loanId,
      });
    }

    return { paidAmount: paid, remainingAmount: remaining, closed: shouldClose };
  }
}
