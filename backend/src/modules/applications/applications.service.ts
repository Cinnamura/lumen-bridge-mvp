import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { calcAnnuity } from '../../common/utils/loan-calculator';

const DAILY_RATE = 0.008;

function toApplicationDto(a: any) {
  return {
    id: a.id,
    type: a.type,
    amount: Number(a.amount),
    termDays: a.termDays ?? undefined,
    termMonths: a.termMonths ?? undefined,
    status: a.status,
    phone: a.phone,
    firstName: a.firstName ?? undefined,
    lastName: a.lastName ?? undefined,
    companyName: a.companyName ?? undefined,
    comment: a.comment ?? undefined,
    createdAt: a.createdAt.toISOString(),
  };
}

@Injectable()
export class ApplicationsService {
  constructor(
    private prisma: PrismaService,
    private notifications: NotificationsService,
  ) {}

  /** Публичная подача заявки. Создаёт/привязывает пользователя по телефону. */
  async create(dto: any) {
    let user = await this.prisma.user.findUnique({ where: { phone: dto.phone } });
    if (!user) {
      user = await this.prisma.user.create({
        data: {
          phone: dto.phone,
          firstName: dto.firstName ?? null,
          lastName: dto.lastName ?? null,
          email: dto.email ?? null,
        },
      });
    }

    const application = await this.prisma.application.create({
      data: {
        userId: user.id,
        type: dto.type,
        amount: new Prisma.Decimal(dto.amount),
        termDays: dto.type === 'personal' ? dto.termDays : null,
        termMonths: dto.type === 'business' ? dto.termMonths : null,
        status: 'new',
        firstName: dto.firstName ?? null,
        lastName: dto.lastName ?? null,
        dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : null,
        email: dto.email ?? null,
        phone: dto.phone,
        companyName: dto.companyName ?? null,
        regNumber: dto.regNumber ?? null,
        repName: dto.repName ?? null,
        repPosition: dto.repPosition ?? null,
      },
    });

    return { id: application.id, status: application.status };
  }

  async listForUser(userId: string) {
    const apps = await this.prisma.application.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return apps.map(toApplicationDto);
  }

  async getForUser(userId: string, id: string) {
    const app = await this.prisma.application.findUnique({ where: { id } });
    if (!app) throw new NotFoundException('Заявка не найдена');
    if (app.userId !== userId) throw new ForbiddenException('Нет доступа к заявке');
    return toApplicationDto(app);
  }

  /**
   * Смена статуса заявки оператором/админом.
   * При approved для personal-заявки создаётся займ (pending_signing)
   * и отправляются уведомления пользователю.
   */
  async updateStatus(id: string, status: string, comment?: string) {
    const app = await this.prisma.application.findUnique({ where: { id } });
    if (!app) throw new NotFoundException('Заявка не найдена');

    const updated = await this.prisma.application.update({
      where: { id },
      data: { status, comment: comment ?? app.comment },
    });

    if (status === 'approved' && app.type === 'personal' && app.userId && app.termDays) {
      await this.createLoanForApplication(updated);
    }

    if (status === 'rejected' && app.userId) {
      await this.notifications.create({
        userId: app.userId,
        type: 'application_rejected',
        title: 'Заявка отклонена',
        body: 'К сожалению, ваша заявка на займ была отклонена.',
        relatedId: app.id,
      });
    }

    return toApplicationDto(updated);
  }

  private async createLoanForApplication(app: any) {
    const amount = Number(app.amount);
    const termDays = app.termDays as number;
    const { payment, total } = calcAnnuity(amount, DAILY_RATE, termDays);

    const loan = await this.prisma.loan.create({
      data: {
        applicationId: app.id,
        userId: app.userId,
        amount: new Prisma.Decimal(amount),
        termDays,
        dailyRate: new Prisma.Decimal(DAILY_RATE),
        dailyPayment: new Prisma.Decimal(payment),
        totalRepayment: new Prisma.Decimal(total),
        status: 'pending_signing',
      },
    });

    await this.notifications.create({
      userId: app.userId,
      type: 'application_approved',
      title: 'Заявка одобрена',
      body: 'Ваша заявка одобрена. Займ ожидает подписания в личном кабинете.',
      relatedId: app.id,
    });
    await this.notifications.create({
      userId: app.userId,
      type: 'loan_pending_signing',
      title: 'Займ ожидает подписания',
      body: 'Перейдите в раздел «Мои займы», чтобы подписать договор.',
      relatedId: loan.id,
    });

    return loan;
  }
}
