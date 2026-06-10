import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';

function addDays(base: Date, days: number): Date {
  const d = new Date(base);
  d.setUTCDate(d.getUTCDate() + days);
  return d;
}

@Injectable()
export class PaymentScheduleService {
  constructor(private prisma: PrismaService) {}

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
}
