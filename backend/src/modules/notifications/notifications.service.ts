import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

export type NotificationType =
  | 'application_approved'
  | 'application_rejected'
  | 'loan_pending_signing'
  | 'loan_signed'
  | 'payment_confirmed'
  | 'payment_rejected'
  | 'payment_overdue'
  | 'loan_closed';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  /** Вызывается из других сервисов при ключевых событиях */
  async create(params: {
    userId: string;
    type: NotificationType;
    title: string;
    body?: string;
    relatedId?: string;
  }) {
    return this.prisma.notification.create({
      data: {
        userId: params.userId,
        type: params.type,
        title: params.title,
        body: params.body,
        relatedId: params.relatedId,
      },
    });
  }

  async listForUser(userId: string) {
    const items = await this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return items.map((n) => ({
      id: n.id,
      type: n.type,
      title: n.title,
      body: n.body,
      isRead: n.isRead,
      relatedId: n.relatedId,
      createdAt: n.createdAt.toISOString(),
    }));
  }

  async markRead(userId: string, id: string) {
    const notification = await this.prisma.notification.findUnique({ where: { id } });
    if (!notification || notification.userId !== userId) {
      throw new NotFoundException('Уведомление не найдено');
    }
    await this.prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });
    return { success: true };
  }
}
