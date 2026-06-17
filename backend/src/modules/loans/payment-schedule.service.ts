import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { buildInstallmentAmounts, replayScheduleRows, roundMoney } from './payment-schedule.utils';

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
    const amounts = buildInstallmentAmounts(
      Number(loan.amount),
      Number(loan.dailyRate),
      loan.termDays,
    );

    const rows: Prisma.PaymentScheduleCreateManyInput[] = amounts.map((amount, index) => ({
      loanId,
      seq: index + 1,
      dueDate: addDays(issued, index + 1),
      amountRequired: new Prisma.Decimal(amount),
      amountPaid: new Prisma.Decimal(0),
      status: 'UNPAID',
    }));

    await this.prisma.paymentSchedule.createMany({ data: rows });
    await this.synchronize(loanId);
  }

  /**
   * Полностью перестраивает календарный график по истории успешных платежей.
   * Даты и seq никогда не сдвигаются: меняются только amountRequired/amountPaid/status.
   */
  async synchronize(loanId: string): Promise<{
    rows: Array<{
      id: string;
      seq: number;
      dueDate: Date;
      amountRequired: number;
      amountPaid: number;
      amountRemaining: number;
      status: string;
      paidAt: Date | null;
    }>;
    paidAmount: number;
    remainingAmount: number;
    totalRepayment: number;
    dailyPayment: number;
    closed: boolean;
    loanStatus: string;
  } | null> {
    const loan = await this.prisma.loan.findUnique({
      where: { id: loanId },
      include: {
        schedule: { orderBy: { seq: 'asc' } },
        payments: {
          where: { status: 'success' },
          orderBy: [{ recordedAt: 'asc' }, { createdAt: 'asc' }],
        },
      },
    });
    if (!loan) return null;
    if (loan.schedule.length === 0) {
      return {
        rows: [],
        paidAmount: Number(loan.paidAmount ?? 0),
        remainingAmount: Number(loan.remainingAmount ?? 0),
        totalRepayment: Number(loan.totalRepayment ?? 0),
        dailyPayment: Number(loan.dailyPayment ?? 0),
        closed: loan.status === 'closed',
        loanStatus: loan.status,
      };
    }

    const normalized = replayScheduleRows({
      rows: loan.schedule.map((row) => ({
        id: row.id,
        seq: row.seq,
        dueDate: row.dueDate,
      })),
      principal: Number(loan.amount),
      dailyRate: Number(loan.dailyRate),
      payments: loan.payments.map((payment) => ({
        amount: Number(payment.amount),
        recordedAt: payment.recordedAt,
      })),
      now: new Date(),
    });

    const nextLoanStatus = normalized.allPaid
      ? 'closed'
      : normalized.rows.some((row) => row.status === 'OVERDUE')
        ? 'overdue'
        : loan.status === 'pending_signing'
          ? 'pending_signing'
          : 'active';
    const shouldClose = normalized.allPaid && loan.status !== 'closed' && loan.status !== 'pending_signing';

    await this.prisma.$transaction(
      [
        ...normalized.rows.map((row) =>
        this.prisma.paymentSchedule.update({
          where: { id: row.id },
          data: {
            amountRequired: new Prisma.Decimal(row.amountRequired),
            amountPaid: new Prisma.Decimal(row.amountPaid),
            status: row.status,
            paidAt: row.paidAt,
          },
        }),
      ),
        this.prisma.loan.update({
          where: { id: loanId },
          data: {
            paidAmount: new Prisma.Decimal(normalized.paidAmount),
            remainingAmount: new Prisma.Decimal(normalized.remainingAmount),
            dailyPayment: new Prisma.Decimal(normalized.currentDailyPayment || 0),
            totalRepayment: new Prisma.Decimal(normalized.totalRepayment),
            status: nextLoanStatus,
            closedAt: shouldClose ? new Date() : normalized.allPaid ? loan.closedAt ?? new Date() : null,
          },
        }),
      ],
    );

    if (shouldClose) {
      await this.notifications.create({
        userId: loan.userId,
        type: 'loan_closed',
        title: 'Займ закрыт',
        body: 'Задолженность полностью погашена. Займ переведён в архив.',
        relatedId: loanId,
      });
    }

    return {
      rows: normalized.rows,
      paidAmount: normalized.paidAmount,
      remainingAmount: normalized.remainingAmount,
      totalRepayment: normalized.totalRepayment,
      dailyPayment: normalized.currentDailyPayment,
      closed: normalized.allPaid,
      loanStatus: nextLoanStatus,
    };
  }

  async applyPayment(loanId: string): Promise<boolean> {
    const snapshot = await this.synchronize(loanId);
    return snapshot?.closed ?? false;
  }

  /**
   * Единый источник истины для баланса займа.
   * Пересчитывает paidAmount как сумму успешных платежей и remainingAmount
   * как остаток к возврату (не меньше нуля). При нулевом остатке —
   * автоматически закрывает займ и уведомляет клиента.
   * Возвращает актуальные значения баланса и флаг закрытия.
   */
  async recalcBalance(loanId: string): Promise<{ paidAmount: number; remainingAmount: number; closed: boolean }> {
    const snapshot = await this.synchronize(loanId);
    if (!snapshot) return { paidAmount: 0, remainingAmount: 0, closed: false };
    return {
      paidAmount: roundMoney(snapshot.paidAmount),
      remainingAmount: roundMoney(snapshot.remainingAmount),
      closed: snapshot.closed,
    };
  }
}
