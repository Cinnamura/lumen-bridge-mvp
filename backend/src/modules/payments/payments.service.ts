import {
  Injectable,
  NotFoundException,
  ForbiddenException,
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
