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
   * Авансовое погашение графика.
   * Источник истины — совокупная сумма успешных платежей по займу.
   * Хронологически помечает как «оплачено» все платежи, которые
   * полностью покрыты внесёнными деньгами (платёж по 1000, внесли 3000 →
   * первые три платежа становятся «ОПЛАЧЕНО»). Суммы строк графика не
   * дробятся — частичный остаток остаётся авансом и уменьшает общий долг.
   * Возвращает true, если все платежи графика оплачены.
   */
  async applyPayment(loanId: string): Promise<boolean> {
    const agg = await this.prisma.payment.aggregate({
      where: { loanId, status: 'success' },
      _sum: { amount: true },
    });
    const totalPaid = Number(agg._sum.amount ?? 0);

    const rows = await this.prisma.paymentSchedule.findMany({
      where: { loanId },
      orderBy: { seq: 'asc' },
    });

    const now = new Date();
    let cumulative = 0;
    let allPaid = true;

    for (const row of rows) {
      cumulative = Math.round((cumulative + Number(row.amount)) * 100) / 100;
      // Платёж считается оплаченным, когда внесённого хватает на него целиком
      const covered = totalPaid + 0.001 >= cumulative;
      if (covered && row.status !== 'paid') {
        await this.prisma.paymentSchedule.update({
          where: { id: row.id },
          data: { status: 'paid', paidAt: now },
        });
      } else if (!covered) {
        allPaid = false;
      }
    }

    return allPaid;
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
