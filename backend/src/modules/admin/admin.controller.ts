import {
  Controller, Get, Patch, Param, Body, Query, Req, UseGuards, Post,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAdminGuard } from '../../common/guards/jwt-admin.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { PrismaService } from '../../database/prisma.service';
import { ApplicationsService } from '../applications/applications.service';
import { NotificationsService } from '../notifications/notifications.service';
import { UpdateApplicationStatusDto } from './dto/update-application-status.dto';
import { UpdatePaymentRequestDto } from './dto/update-payment-request.dto';

interface AdminPayload { id: string; login: string; role: 'admin' | 'operator' }

@Controller('admin')
@UseGuards(JwtAdminGuard)
export class AdminController {
  constructor(
    private prisma: PrismaService,
    private applications: ApplicationsService,
    private notifications: NotificationsService,
  ) {}

  /** Профиль текущего админа/оператора (нужен фронту для отображения роли). */
  @Get('me')
  me(@CurrentUser() user: AdminPayload) {
    return { id: user.id, login: user.login, role: user.role };
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
    // Operator and admin can both change status
    void user; void req;
    return this.applications.updateStatus(id, dto.status, dto.comment);
  }

  // ── Клиенты ─────────────────────────────────────────────────────────────
  @Get('clients')
  async listClients(
    @Query('page')  page?:  string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
  ) {
    const pg = Math.max(1, page  ? Number(page)  : 1);
    const lm = Math.min(100, Math.max(1, limit ? Number(limit) : 20));
    const where: any = search
      ? {
          OR: [
            { phone:    { contains: search, mode: 'insensitive' } },
            { firstName:{ contains: search, mode: 'insensitive' } },
            { lastName: { contains: search, mode: 'insensitive' } },
            { email:    { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};
    const [total, items] = await this.prisma.$transaction([
      this.prisma.user.count({ where }),
      this.prisma.user.findMany({
        where, orderBy: { createdAt: 'desc' }, skip: (pg - 1) * lm, take: lm,
        select: {
          id: true, phone: true, firstName: true, lastName: true, email: true, createdAt: true,
          _count: { select: { applications: true, loans: true } },
        },
      }),
    ]);
    return {
      data: items.map((u) => ({
        id: u.id, phone: u.phone,
        firstName: u.firstName ?? '', lastName: u.lastName ?? '',
        email: u.email ?? '', createdAt: u.createdAt.toISOString(),
        applicationsCount: u._count.applications,
        loansCount: u._count.loans,
      })),
      total, page: pg, limit: lm,
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
        status: l.status,
        issuedAt: l.issuedAt?.toISOString(),
        closedAt: l.closedAt?.toISOString(),
        createdAt: l.createdAt.toISOString(),
      })),
      total, page: pg, limit: lm,
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

  @Patch('payment-requests/:id')
  async updatePaymentRequest(
    @Param('id') id: string,
    @Body() dto: UpdatePaymentRequestDto,
    @CurrentUser() user: AdminPayload,
  ) {
    const updated = await this.prisma.paymentRequest.update({
      where: { id },
      data: { status: dto.status, reviewedAt: new Date(), reviewedBy: user.id },
      include: { user: { select: { id: true } } },
    });
    if (updated.user?.id) {
      await this.notifications.create({
        userId: updated.user.id,
        type:  dto.status === 'confirmed' ? 'payment_confirmed' : 'payment_rejected',
        title: dto.status === 'confirmed' ? 'Платёж подтверждён' : 'Заявка на оплату отклонена',
        body:  dto.status === 'confirmed' ? 'Ваш платёж подтверждён оператором.' : 'К сожалению, заявка на оплату была отклонена.',
        relatedId: updated.id,
      });
    }
    return { id: updated.id, status: updated.status, reviewedAt: updated.reviewedAt };
  }

  // ── Уведомления (агрегация системных событий) ──────────────────────────
  @Get('notifications')
  async systemNotifications() {
    const [newApps, overdue, recentReviews] = await Promise.all([
      this.prisma.application.count({ where: { status: 'new' } }),
      this.prisma.loan.count({ where: { status: 'overdue' } }),
      this.prisma.paymentRequest.findMany({
        where: { status: 'pending' }, take: 5, orderBy: { createdAt: 'desc' },
        include: { user: { select: { phone: true, firstName: true, lastName: true } } },
      }),
    ]);
    return {
      counts: { newApplications: newApps, overdueLoans: overdue, pendingPayments: recentReviews.length },
      recent: recentReviews.map((p) => ({
        id: p.id, type: 'payment_request_pending',
        title: `Заявка на оплату: ${p.amount} EUR`,
        body: `${p.user.firstName ?? ''} ${p.user.lastName ?? ''} (${p.user.phone})`,
        createdAt: p.createdAt.toISOString(),
      })),
    };
  }
}
