import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
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
    email: a.email ?? undefined,
    firstName: a.firstName ?? undefined,
    lastName: a.lastName ?? undefined,
    companyName: a.companyName ?? undefined,
    regNumber: a.regNumber ?? undefined,
    repName: a.repName ?? undefined,
    repPosition: a.repPosition ?? undefined,
    comment: a.comment ?? undefined,
    createdAt: a.createdAt.toISOString(),
  };
}

@Injectable()
export class ApplicationsService {
  constructor(
    private prisma: PrismaService,
    private notifications: NotificationsService,
    private jwt: JwtService,
  ) {}

  /**
   * Public application submission.
   * Finds or creates a user by phone, then creates the application.
   * Returns the application id and a fresh JWT for that user so the
   * frontend can overwrite any stale token in localStorage.
   */
  async create(dto: any) {
    // Validate dateOfBirth range server-side to prevent year > 9999 and
    // other out-of-range values that would crash Postgres or produce garbage data.
    if (dto.dateOfBirth) {
      const dob = new Date(dto.dateOfBirth);
      const year = dob.getUTCFullYear();
      const minYear = 1900;
      const maxYear = new Date().getUTCFullYear() - 18;
      if (isNaN(dob.getTime()) || year < minYear || year > maxYear) {
        throw new BadRequestException(
          `Дата рождения должна быть между ${minYear} и ${maxYear} годом`,
        );
      }
    }

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
    } else if (dto.type === 'personal') {
      // Backfill name/email on existing user if previously empty
      const updates: Record<string, string> = {};
      if (!user.firstName && dto.firstName) updates.firstName = dto.firstName;
      if (!user.lastName  && dto.lastName)  updates.lastName  = dto.lastName;
      if (!user.email     && dto.email)     updates.email     = dto.email;
      if (Object.keys(updates).length > 0) {
        user = await this.prisma.user.update({ where: { id: user.id }, data: updates });
      }
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

    const accessToken = this.jwt.sign(
      { sub: user.id, type: 'user' },
      { expiresIn: '24h' },
    );

    return { id: application.id, status: application.status, accessToken };
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

  /** Список всех заявок для админ-панели с пагинацией и фильтром по статусу. */
  async listAll(opts: { page?: number; limit?: number; status?: string; search?: string } = {}) {
    const page  = Math.max(1, opts.page  ?? 1);
    const limit = Math.min(100, Math.max(1, opts.limit ?? 20));
    const skip  = (page - 1) * limit;

    const where: any = {};
    if (opts.status) where.status = opts.status;
    if (opts.search) {
      where.OR = [
        { firstName:  { contains: opts.search, mode: 'insensitive' } },
        { lastName:   { contains: opts.search, mode: 'insensitive' } },
        { phone:      { contains: opts.search, mode: 'insensitive' } },
        { email:      { contains: opts.search, mode: 'insensitive' } },
        { companyName:{ contains: opts.search, mode: 'insensitive' } },
      ];
    }

    const [total, items] = await this.prisma.$transaction([
      this.prisma.application.count({ where }),
      this.prisma.application.findMany({
        where, orderBy: { createdAt: 'desc' }, skip, take: limit,
        include: { user: { select: { id: true, phone: true, firstName: true, lastName: true } } },
      }),
    ]);

    return {
      data: items.map((a) => ({
        ...toApplicationDto(a),
        user: a.user ? {
          id: a.user.id,
          phone: a.user.phone,
          firstName: a.user.firstName ?? undefined,
          lastName: a.user.lastName ?? undefined,
        } : undefined,
      })),
      total, page, limit,
    };
  }

  async getOneForAdmin(id: string) {
    const app = await this.prisma.application.findUnique({
      where: { id },
      include: { user: { select: { id: true, phone: true, firstName: true, lastName: true, email: true } } },
    });
    if (!app) throw new NotFoundException('Заявка не найдена');
    return {
      ...toApplicationDto(app),
      user: app.user ? {
        id: app.user.id, phone: app.user.phone,
        firstName: app.user.firstName ?? undefined,
        lastName:  app.user.lastName  ?? undefined,
        email:     app.user.email     ?? undefined,
      } : undefined,
    };
  }

  /**
   * Смена статуса заявки оператором/админом.
   * При approved для personal-заявки создаётся займ (pending_signing)
   * и отправляются уведомления пользователю.
   */
  async updateStatus(id: string, status: string, comment?: string) {
    const app = await this.prisma.application.findUnique({ where: { id } });
    if (!app) throw new NotFoundException('Заявка не найдена');

    // Конечный автомат статусов заявки. approved/rejected — терминальные:
    // одобренную заявку (по которой уже создан займ) нельзя отклонить.
    const ALLOWED: Record<string, string[]> = {
      new:       ['in_review', 'approved', 'rejected'],
      in_review: ['approved', 'rejected'],
      approved:  [],
      rejected:  [],
    };
    if (app.status !== status) {
      const allowed = ALLOWED[app.status] ?? [];
      if (!allowed.includes(status)) {
        throw new BadRequestException(
          `Недопустимый переход статуса заявки: «${app.status}» → «${status}»`,
        );
      }
    }

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
