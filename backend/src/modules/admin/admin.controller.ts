import {
  Controller, Get, Patch, Param, Body, Query, Req, UseGuards, Post,
  ConflictException, NotFoundException, BadRequestException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Request } from 'express';
import * as bcrypt from 'bcrypt';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAdminGuard } from '../../common/guards/jwt-admin.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { PrismaService } from '../../database/prisma.service';
import { ApplicationsService } from '../applications/applications.service';
import { NotificationsService } from '../notifications/notifications.service';
import { PaymentScheduleService } from '../loans/payment-schedule.service';
import { UpdateApplicationStatusDto } from './dto/update-application-status.dto';
import { UpdateApplicationCommentDto } from './dto/update-application-comment.dto';
import { UpdatePaymentRequestDto } from './dto/update-payment-request.dto';
import { UpdateLoanStatusDto } from './dto/update-loan-status.dto';
import { RecordPaymentDto } from './dto/record-payment.dto';
import { CreateAdminUserDto } from './dto/create-admin-user.dto';
import { UpdateAdminUserDto } from './dto/update-admin-user.dto';

interface AdminPayload { id: string; login: string; role: 'admin' | 'operator' }

@Controller('admin')
@UseGuards(JwtAdminGuard, RolesGuard)
@Roles('admin', 'operator')
export class AdminController {
  constructor(
    private prisma: PrismaService,
    private applications: ApplicationsService,
    private notifications: NotificationsService,
    private schedule: PaymentScheduleService,
  ) {}

  /** Профиль текущего админа/оператора (нужен фронту для отображения роли). */
  @Get('me')
  me(@CurrentUser() user: AdminPayload) {
    return { id: user.id, login: user.login, role: user.role };
  }

  private serializeAdminUser(admin: { id: string; login: string; role: string; createdAt: Date }) {
    return {
      id: admin.id,
      login: admin.login,
      role: admin.role as 'admin' | 'operator',
      createdAt: admin.createdAt.toISOString(),
    };
  }

  private deriveClientStatus(loans: Array<{ status: string }>, applications: Array<{ status: string }>) {
    if (loans.some((loan) => loan.status === 'overdue')) return 'overdue';
    if (loans.some((loan) => loan.status === 'active' || loan.status === 'pending_signing')) return 'active';
    if (loans.length > 0) return 'closed';
    if (applications.length > 0) return 'applicant';
    return 'new';
  }

  // ── Учётные записи сотрудников (admin only) ────────────────────────────
  @Get('staff')
  @Roles('admin')
  async listStaff(@Query('search') search?: string) {
    const where = search
      ? {
          login: { contains: search, mode: 'insensitive' as const },
        }
      : {};

    const admins = await this.prisma.adminUser.findMany({
      where,
      orderBy: [{ role: 'asc' }, { createdAt: 'asc' }],
      select: { id: true, login: true, role: true, createdAt: true },
    });

    return admins.map((admin) => this.serializeAdminUser(admin));
  }

  @Post('staff')
  @Roles('admin')
  async createStaff(@Body() dto: CreateAdminUserDto) {
    const exists = await this.prisma.adminUser.findUnique({ where: { login: dto.login } });
    if (exists) {
      throw new ConflictException('Пользователь с таким логином уже существует');
    }

    const created = await this.prisma.adminUser.create({
      data: {
        login: dto.login,
        passwordHash: await bcrypt.hash(dto.password, 10),
        role: dto.role,
      },
      select: { id: true, login: true, role: true, createdAt: true },
    });

    return this.serializeAdminUser(created);
  }

  @Patch('staff/:id')
  @Roles('admin')
  async updateStaff(
    @Param('id') id: string,
    @Body() dto: UpdateAdminUserDto,
    @CurrentUser() user: AdminPayload,
  ) {
    const admin = await this.prisma.adminUser.findUnique({ where: { id } });
    if (!admin) throw new NotFoundException('Сотрудник не найден');

    if (dto.login && dto.login !== admin.login) {
      const exists = await this.prisma.adminUser.findUnique({ where: { login: dto.login } });
      if (exists) {
        throw new ConflictException('Пользователь с таким логином уже существует');
      }
    }

    if (dto.role && admin.role === 'admin' && dto.role !== 'admin') {
      const adminsCount = await this.prisma.adminUser.count({ where: { role: 'admin' } });
      if (adminsCount <= 1) {
        throw new BadRequestException('В системе должен остаться хотя бы один администратор');
      }
      if (admin.id === user.id) {
        throw new BadRequestException('Нельзя понизить собственную роль в текущей сессии');
      }
    }

    const updated = await this.prisma.adminUser.update({
      where: { id },
      data: {
        ...(dto.login ? { login: dto.login } : {}),
        ...(dto.role ? { role: dto.role } : {}),
        ...(dto.password ? { passwordHash: await bcrypt.hash(dto.password, 10) } : {}),
      },
      select: { id: true, login: true, role: true, createdAt: true },
    });

    return this.serializeAdminUser(updated);
  }

  // ── Заявки ──────────────────────────────────────────────────────────────
  @Get('applications')
  listApplications(
    @Query('page')   page?:   string,
    @Query('limit')  limit?:  string,
    @Query('status') status?: string,
    @Query('search') search?: string,
  ) {
    return this.applications.listAll({
      page:   page   ? Number(page)   : undefined,
      limit:  limit  ? Number(limit)  : undefined,
      status: status || undefined,
      search: search || undefined,
    });
  }

  @Get('applications/:id')
  getApplication(@Param('id') id: string) {
    return this.applications.getOneForAdmin(id);
  }

  @Patch('applications/:id/status')
  updateApplicationStatus(
    @Param('id') id: string,
    @Body() dto: UpdateApplicationStatusDto,
    @CurrentUser() user: AdminPayload,
    @Req() req: Request,
  ) {
    void user; void req;
    return this.applications.updateStatus(id, dto.status, dto.comment);
  }

  @Patch('applications/:id/comment')
  async updateApplicationComment(
    @Param('id') id: string,
    @Body() dto: UpdateApplicationCommentDto,
  ) {
    const app = await this.prisma.application.findUnique({ where: { id } });
    if (!app) throw new NotFoundException('Заявка не найдена');
    const updated = await this.prisma.application.update({
      where: { id },
      data: { comment: dto.comment ?? null },
    });
    return { id: updated.id, comment: updated.comment };
  }

  // ── Клиенты ─────────────────────────────────────────────────────────────
  @Get('clients')
  async listClients(
    @Query('page')  page?:  string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('status') status?: string,
  ) {
    const pg = Math.max(1, page  ? Number(page)  : 1);
    const lm = Math.min(100, Math.max(1, limit ? Number(limit) : 20));
    const where: any = {};

    if (search) {
      where.OR = [
        { phone:    { contains: search, mode: 'insensitive' } },
        { firstName:{ contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email:    { contains: search, mode: 'insensitive' } },
      ];
    }
    if (status === 'active') {
      where.loans = { some: { status: { in: ['active', 'pending_signing'] } } };
    } else if (status === 'overdue') {
      where.loans = { some: { status: 'overdue' } };
    } else if (status === 'no_loans') {
      where.loans = { none: {} };
    }

    const [total, items] = await this.prisma.$transaction([
      this.prisma.user.count({ where }),
      this.prisma.user.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (pg - 1) * lm,
        take: lm,
        select: {
          id: true,
          phone: true,
          firstName: true,
          lastName: true,
          email: true,
          createdAt: true,
          _count: { select: { applications: true, loans: true } },
          loans: { select: { status: true } },
          applications: { select: { status: true } },
        },
      }),
    ]);

    return {
      data: items.map((u) => ({
        id: u.id,
        phone: u.phone,
        firstName: u.firstName ?? '',
        lastName: u.lastName ?? '',
        email: u.email ?? '',
        createdAt: u.createdAt.toISOString(),
        applicationsCount: u._count.applications,
        loansCount: u._count.loans,
        status: this.deriveClientStatus(u.loans, u.applications),
      })),
      total,
      page: pg,
      limit: lm,
    };
  }

  /** Карточка клиента: контакты + история заявок + займы + платежи. */
  @Get('clients/:id')
  async getClient(@Param('id') id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        applications: { orderBy: { createdAt: 'desc' } },
        loans: {
          orderBy: { createdAt: 'desc' },
          include: {
            payments: { orderBy: { recordedAt: 'desc' } },
            paymentRequests: { orderBy: { createdAt: 'desc' } },
          },
        },
      },
    });
    if (!user) throw new NotFoundException('Клиент не найден');
    return {
      id: user.id, phone: user.phone,
      firstName: user.firstName ?? '', lastName: user.lastName ?? '', email: user.email ?? '',
      createdAt: user.createdAt.toISOString(),
      applications: user.applications.map((a) => ({
        id: a.id, type: a.type, amount: Number(a.amount),
        termDays: a.termDays, termMonths: a.termMonths,
        status: a.status, createdAt: a.createdAt.toISOString(),
      })),
      loans: user.loans.map((l) => ({
        id: l.id, amount: Number(l.amount), termDays: l.termDays,
        totalRepayment: Number(l.totalRepayment),
        paidAmount: Number(l.paidAmount), remainingAmount: Number(l.remainingAmount),
        status: l.status,
        issuedAt: l.issuedAt?.toISOString(), closedAt: l.closedAt?.toISOString(),
        payments: l.payments.map((p) => ({
          id: p.id, amount: Number(p.amount), recordedAt: p.recordedAt.toISOString(), note: p.note,
        })),
        paymentRequests: l.paymentRequests.map((pr) => ({
          id: pr.id, amount: Number(pr.amount), reference: pr.reference,
          status: pr.status, createdAt: pr.createdAt.toISOString(),
        })),
      })),
    };
  }

  // ── Займы ───────────────────────────────────────────────────────────────
  @Get('loans')
  async listLoans(
    @Query('page')  page?:  string,
    @Query('limit') limit?: string,
    @Query('status') status?: string,
  ) {
    const pg = Math.max(1, page  ? Number(page)  : 1);
    const lm = Math.min(100, Math.max(1, limit ? Number(limit) : 20));
    const where: any = status ? { status } : {};
    const [total, items] = await this.prisma.$transaction([
      this.prisma.loan.count({ where }),
      this.prisma.loan.findMany({
        where, orderBy: { createdAt: 'desc' }, skip: (pg - 1) * lm, take: lm,
        include: { user: { select: { id: true, phone: true, firstName: true, lastName: true } } },
      }),
    ]);
    return {
      data: items.map((l) => ({
        id: l.id, applicationId: l.applicationId,
        userId: l.userId, user: l.user,
        amount: Number(l.amount), termDays: l.termDays,
        dailyRate: Number(l.dailyRate), dailyPayment: Number(l.dailyPayment),
        totalRepayment: Number(l.totalRepayment),
        paidAmount: Number(l.paidAmount), remainingAmount: Number(l.remainingAmount),
        status: l.status,
        issuedAt: l.issuedAt?.toISOString(),
        closedAt: l.closedAt?.toISOString(),
        createdAt: l.createdAt.toISOString(),
      })),
      total, page: pg, limit: lm,
    };
  }

  /** Карточка займа: параметры + полный график + история платежей. */
  @Get('loans/:id')
  async getLoan(@Param('id') id: string) {
    const loan = await this.prisma.loan.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, phone: true, firstName: true, lastName: true, email: true } },
        schedule: { orderBy: { seq: 'asc' } },
        payments: { orderBy: { recordedAt: 'desc' } },
        paymentRequests: { orderBy: { createdAt: 'desc' } },
      },
    });
    if (!loan) throw new NotFoundException('Займ не найден');
    return {
      id: loan.id, applicationId: loan.applicationId,
      userId: loan.userId, user: loan.user,
      amount: Number(loan.amount), termDays: loan.termDays,
      dailyRate: Number(loan.dailyRate), dailyPayment: Number(loan.dailyPayment),
      totalRepayment: Number(loan.totalRepayment),
      paidAmount: Number(loan.paidAmount), remainingAmount: Number(loan.remainingAmount),
      status: loan.status,
      signedAt: loan.signedAt?.toISOString(), signedIp: loan.signedIp,
      issuedAt: loan.issuedAt?.toISOString(), closedAt: loan.closedAt?.toISOString(),
      createdAt: loan.createdAt.toISOString(),
      schedule: loan.schedule.map((s) => ({
        id: s.id, seq: s.seq, dueDate: s.dueDate.toISOString(),
        amount: Number(s.amount), status: s.status, paidAt: s.paidAt?.toISOString(),
      })),
      payments: loan.payments.map((p) => ({
        id: p.id, amount: Number(p.amount), status: p.status,
        recordedAt: p.recordedAt.toISOString(), note: p.note,
      })),
      paymentRequests: loan.paymentRequests.map((pr) => ({
        id: pr.id, amount: Number(pr.amount), reference: pr.reference,
        status: pr.status, createdAt: pr.createdAt.toISOString(),
        reviewedAt: pr.reviewedAt?.toISOString(),
      })),
    };
  }

  /** Смена статуса займа оператором/админом (active / overdue / closed). */
  @Patch('loans/:id/status')
  async updateLoanStatus(@Param('id') id: string, @Body() dto: UpdateLoanStatusDto) {
    const loan = await this.prisma.loan.findUnique({ where: { id } });
    if (!loan) throw new NotFoundException('Займ не найден');

    // Конечный автомат статусов займа. Закрытый займ — терминальный;
    // нельзя реактивировать или «отклонить» выданный/погашенный займ.
    const ALLOWED: Record<string, string[]> = {
      pending_signing: [],                  // меняется только подписанием клиента
      active:          ['overdue', 'closed'],
      overdue:         ['active', 'closed'],
      closed:          [],
    };
    if (loan.status !== dto.status) {
      const allowed = ALLOWED[loan.status] ?? [];
      if (!allowed.includes(dto.status)) {
        throw new BadRequestException(
          `Недопустимый переход статуса займа: «${loan.status}» → «${dto.status}»`,
        );
      }
    }

    const updated = await this.prisma.loan.update({
      where: { id },
      data: {
        status: dto.status,
        closedAt: dto.status === 'closed' ? new Date() : loan.closedAt,
      },
    });
    if (dto.status === 'closed') {
      await this.notifications.create({
        userId: loan.userId, type: 'loan_closed',
        title: 'Займ закрыт', body: 'Ваш займ полностью погашен и закрыт.',
        relatedId: loan.id,
      });
    }
    return { id: updated.id, status: updated.status, closedAt: updated.closedAt?.toISOString() ?? null };
  }

  /**
   * Фиксация реального платежа (только admin). Создаёт запись в payments,
   * пересчитывает график и закрывает займ при полном погашении.
   */
  @Post('loans/:id/payments')
  @Roles('admin')
  async recordPayment(
    @Param('id') id: string,
    @Body() dto: RecordPaymentDto,
    @CurrentUser() user: AdminPayload,
  ) {
    const loan = await this.prisma.loan.findUnique({ where: { id } });
    if (!loan) throw new NotFoundException('Займ не найден');

    if (loan.status === 'closed') {
      throw new BadRequestException('Займ уже закрыт — задолженность отсутствует');
    }

    const amount = dto.amount;
    const remaining = Number(loan.remainingAmount);
    if (amount > remaining) {
      throw new BadRequestException('Сумма платежа превышает остаток задолженности');
    }

    await this.prisma.payment.create({
      data: {
        loanId: id,
        amount: new Prisma.Decimal(amount),
        status: 'success',
        recordedAt: new Date(),
        recordedBy: user.id,
        note: dto.note ?? null,
      },
    });

    // Отмечаем строки графика и пересчитываем баланс (единый источник истины)
    await this.schedule.applyPayment(id);
    const balance = await this.schedule.recalcBalance(id);

    await this.notifications.create({
      userId: loan.userId, type: 'payment_confirmed',
      title: 'Платёж зафиксирован',
      body: `Платёж на сумму ${amount.toFixed(2)} EUR зачтён. Остаток: ${balance.remainingAmount.toFixed(2)} EUR.`,
      relatedId: loan.id,
    });

    const schedule = await this.prisma.paymentSchedule.findMany({
      where: { loanId: id }, orderBy: { seq: 'asc' },
    });
    return {
      id,
      status: balance.closed ? 'closed' : loan.status,
      closed: balance.closed,
      paidAmount: balance.paidAmount,
      remainingAmount: balance.remainingAmount,
      schedule: schedule.map((s) => ({
        seq: s.seq, dueDate: s.dueDate.toISOString(), amount: Number(s.amount), status: s.status,
      })),
    };
  }

  // ── Заявки на оплату ────────────────────────────────────────────────────
  @Get('payment-requests')
  async listPaymentRequests(
    @Query('page')  page?:  string,
    @Query('limit') limit?: string,
    @Query('status') status?: string,
  ) {
    const pg = Math.max(1, page  ? Number(page)  : 1);
    const lm = Math.min(100, Math.max(1, limit ? Number(limit) : 20));
    const where: any = status ? { status } : {};
    const [total, items] = await this.prisma.$transaction([
      this.prisma.paymentRequest.count({ where }),
      this.prisma.paymentRequest.findMany({
        where, orderBy: { createdAt: 'desc' }, skip: (pg - 1) * lm, take: lm,
        include: { user: { select: { id: true, phone: true, firstName: true, lastName: true } } },
      }),
    ]);
    return {
      data: items.map((p) => ({
        id: p.id, loanId: p.loanId, userId: p.userId, user: p.user,
        amount: Number(p.amount), reference: p.reference, status: p.status,
        createdAt: p.createdAt.toISOString(),
        reviewedAt: p.reviewedAt?.toISOString() ?? null,
      })),
      total, page: pg, limit: lm,
    };
  }

  /**
   * Подтверждение/отклонение заявки клиента на оплату.
   * При подтверждении создаётся реальный платёж по займу, график
   * пересчитывается и при полном погашении займ закрывается —
   * это тот же баланс-движок, что и при прямой фиксации платежа.
   */
  @Patch('payment-requests/:id')
  async updatePaymentRequest(
    @Param('id') id: string,
    @Body() dto: UpdatePaymentRequestDto,
    @CurrentUser() user: AdminPayload,
  ) {
    const request = await this.prisma.paymentRequest.findUnique({
      where: { id },
      include: { loan: true, user: { select: { id: true } } },
    });
    if (!request) throw new NotFoundException('Заявка на оплату не найдена');
    if (request.status !== 'pending') {
      throw new BadRequestException('Заявка уже обработана');
    }

    if (dto.status === 'confirmed') {
      const loan = request.loan;
      if (loan.status === 'closed') {
        throw new BadRequestException('Займ уже закрыт — задолженность отсутствует');
      }
      const amount = Number(request.amount);
      const remaining = Number(loan.remainingAmount);
      if (amount > remaining) {
        throw new BadRequestException('Сумма платежа превышает остаток задолженности');
      }

      await this.prisma.payment.create({
        data: {
          loanId: loan.id,
          amount: new Prisma.Decimal(amount),
          status: 'success',
          recordedAt: new Date(),
          recordedBy: user.id,
          note: `Подтверждена заявка на оплату (reference: ${request.reference})`,
        },
      });

      await this.schedule.applyPayment(loan.id);
      const balance = await this.schedule.recalcBalance(loan.id);

      await this.notifications.create({
        userId: loan.userId, type: 'payment_confirmed',
        title: 'Платёж подтверждён',
        body: `Ваш платёж на сумму ${amount.toFixed(2)} EUR подтверждён. Остаток: ${balance.remainingAmount.toFixed(2)} EUR.`,
        relatedId: loan.id,
      });
    } else {
      await this.notifications.create({
        userId: request.userId, type: 'payment_rejected',
        title: 'Заявка на оплату отклонена',
        body: 'К сожалению, заявка на оплату была отклонена.',
        relatedId: request.id,
      });
    }

    const updated = await this.prisma.paymentRequest.update({
      where: { id },
      data: { status: dto.status, reviewedAt: new Date(), reviewedBy: user.id },
    });
    return { id: updated.id, status: updated.status, reviewedAt: updated.reviewedAt };
  }

  // ── Уведомления (агрегация системных событий) ──────────────────────────
  @Get('notifications')
  async systemNotifications() {
    const [newApps, overdue, pendingPayments, recentApplications, recentOverdueLoans, recentReviews] = await Promise.all([
      this.prisma.application.count({ where: { status: 'new' } }),
      this.prisma.loan.count({ where: { status: 'overdue' } }),
      this.prisma.paymentRequest.count({ where: { status: 'pending' } }),
      this.prisma.application.findMany({
        where: { status: 'new' },
        take: 4,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          type: true,
          amount: true,
          createdAt: true,
          firstName: true,
          lastName: true,
          companyName: true,
          phone: true,
        },
      }),
      this.prisma.loan.findMany({
        where: { status: 'overdue' },
        take: 4,
        orderBy: { updatedAt: 'desc' },
        select: {
          id: true,
          amount: true,
          updatedAt: true,
          user: { select: { phone: true, firstName: true, lastName: true } },
        },
      }),
      this.prisma.paymentRequest.findMany({
        where: { status: 'pending' },
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { phone: true, firstName: true, lastName: true } } },
      }),
    ]);

    const recent = [
      ...recentApplications.map((app) => ({
        id: `application:${app.id}`,
        type: 'application_new',
        title: 'Новая заявка',
        body: app.type === 'business'
          ? `${app.companyName ?? 'Бизнес-клиент'} • ${Number(app.amount).toFixed(2)} EUR`
          : `${[app.firstName, app.lastName].filter(Boolean).join(' ') || app.phone || 'Клиент'} • ${Number(app.amount).toFixed(2)} EUR`,
        createdAt: app.createdAt.toISOString(),
        href: `/admin/applications/${app.id}`,
      })),
      ...recentOverdueLoans.map((loan) => ({
        id: `loan:${loan.id}`,
        type: 'loan_overdue',
        title: 'Просрочка по займу',
        body: `${[loan.user.firstName, loan.user.lastName].filter(Boolean).join(' ') || loan.user.phone} • ${Number(loan.amount).toFixed(2)} EUR`,
        createdAt: loan.updatedAt.toISOString(),
        href: `/admin/loans/${loan.id}`,
      })),
      ...recentReviews.map((p) => ({
        id: `payment:${p.id}`,
        type: 'payment_request_pending',
        title: `Заявка на оплату: ${Number(p.amount).toFixed(2)} EUR`,
        body: `${p.user.firstName ?? ''} ${p.user.lastName ?? ''} (${p.user.phone})`.trim(),
        createdAt: p.createdAt.toISOString(),
        href: '/admin/payments',
      })),
    ]
      .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
      .slice(0, 10);

    return {
      counts: { newApplications: newApps, overdueLoans: overdue, pendingPayments },
      recent,
    };
  }
}
