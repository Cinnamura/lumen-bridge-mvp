import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { PaymentScheduleService } from '../loans/payment-schedule.service';
import { roundMoney } from '../loans/payment-schedule.utils';

function toPaymentRequestDto(p: any) {
  return {
    id: p.id,
    loanId: p.loanId,
    amount: Number(p.amount),
    reference: p.reference,
    status: p.status,
    createdAt: p.createdAt.toISOString(),
    reviewedAt: p.reviewedAt?.toISOString(),
  };
}

@Injectable()
export class PaymentsService {
  constructor(
    private prisma: PrismaService,
    private schedule: PaymentScheduleService,
  ) {}

  async createRequest(userId: string, dto: any) {
    const loan = await this.prisma.loan.findUnique({ where: { id: dto.loanId } });
    if (!loan) throw new NotFoundException('Займ не найден');
    if (loan.userId !== userId) throw new ForbiddenException('Нет доступа к займу');

    if (loan.status === 'closed') {
      throw new BadRequestException('Займ уже закрыт — задолженность отсутствует');
    }

    // Рассчитываем максимально допустимую сумму платежа — это
    // сумма досрочного погашения (тело + проценты за один день).
    // Она всегда <= остатку задолженности. Платёж сверх этой суммы
    // означал бы списание процентов за будущие (ещё не прожитые) дни.
    const snapshot = await this.schedule.synchronize(loan.id);
    const dailyRate = Number(loan.dailyRate);
    const outstandingPrincipal = snapshot?.outstandingPrincipal ?? Number(loan.amount);
    const payoffAmount = roundMoney(outstandingPrincipal + outstandingPrincipal * dailyRate);
    const maxAllowed = Math.min(payoffAmount, Number(loan.remainingAmount));

    let amount = roundMoney(Number(dto.amount));
    if (amount <= 0) throw new BadRequestException('Сумма должна быть больше нуля');

    // Автоматически срезаем до payoff amount — не принимаем будущие проценты
    if (amount > maxAllowed) {
      amount = roundMoney(maxAllowed);
    }

    const created = await this.prisma.paymentRequest.create({
      data: {
        loanId: dto.loanId,
        userId,
        amount: new Prisma.Decimal(amount),
        reference: dto.reference,
        status: 'pending',
      },
    });
    return { ...toPaymentRequestDto(created), cappedToPayoff: amount < roundMoney(Number(dto.amount)) };
  }

  async listForUser(userId: string) {
    const items = await this.prisma.paymentRequest.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return items.map(toPaymentRequestDto);
  }
}
