import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';

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
  constructor(private prisma: PrismaService) {}

  async createRequest(userId: string, dto: any) {
    const loan = await this.prisma.loan.findUnique({ where: { id: dto.loanId } });
    if (!loan) throw new NotFoundException('Займ не найден');
    if (loan.userId !== userId) throw new ForbiddenException('Нет доступа к займу');

    if (loan.status === 'closed') {
      throw new BadRequestException('Займ уже закрыт — задолженность отсутствует');
    }

    const amount = Number(dto.amount);
    const remaining = Number(loan.remainingAmount);
    if (amount > remaining) {
      throw new BadRequestException('Сумма платежа превышает остаток задолженности');
    }

    const created = await this.prisma.paymentRequest.create({
      data: {
        loanId: dto.loanId,
        userId,
        amount: new Prisma.Decimal(dto.amount),
        reference: dto.reference,
        status: 'pending',
      },
    });
    return toPaymentRequestDto(created);
  }

  async listForUser(userId: string) {
    const items = await this.prisma.paymentRequest.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return items.map(toPaymentRequestDto);
  }
}
