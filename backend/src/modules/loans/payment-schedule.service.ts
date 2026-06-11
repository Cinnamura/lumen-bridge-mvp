import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';

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
    const dailyPayment = loan.dailyPayment;

    const rows: Prisma.PaymentScheduleCreateManyInput[] = [];
    for (let seq = 1; seq <= loan.termDays; seq++) {
      rows.push({
        loanId,
        seq,
        dueDate: addDays(issued, seq),
        amount: dailyPayment,
        status: 'pending',
      });
    }

    await this.prisma.paymentSchedule.createMany({ data: rows });
  }

  /**
   * Пересчёт графика после зафиксированного платежа.
   * Гасит ближайшие pending-платежи; при переплате переходит к следующим;
   * при частичной оплате уменьшает сумму ближайшего платежа.
   * Возвращает true, если займ полностью погашен.
   */
  async applyPayment(loanId: string, amount: number): Promise<boolean> {
    let remaining = amount;

    while (remaining > 0) {
      const next = await this.prisma.paymentSchedule.findFirst({
        where: { loanId, status: 'pending' },
        orderBy: { seq: 'asc' },
      });
      if (!next) break;

      const due = Number(next.amount);
      if (remaining >= due) {
        await this.prisma.paymentSchedule.update({
          where: { id: next.id },
          data: { status: 'paid', paidAt: new Date() },
        });
        remaining -= due;
      } else {
        await this.prisma.paymentSchedule.update({
          where: { id: next.id },
          data: { amount: new Prisma.Decimal(due - remaining) },
        });
        remaining = 0;
      }
    }

    const left = await this.prisma.paymentSchedule.count({
      where: { loanId, status: 'pending' },
    });
    return left === 0;
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
    const paid = Number(agg._sum.amount ?? 0);
    const remaining = Math.max(0, Math.round((total - paid) * 100) / 100);
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
