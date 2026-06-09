import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async requestOtp(phone: string): Promise<{ mockCode: string }> {
    const code = String(Math.floor(100000 + Math.random() * 900000));
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await this.prisma.otpCode.create({
      data: { phone, code, purpose: 'login', expiresAt },
    });

    return { mockCode: code };
  }

  async verifyOtp(phone: string, code: string) {
    const otp = await this.prisma.otpCode.findFirst({
      where: {
        phone,
        code,
        purpose: 'login',
        used: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!otp) throw new UnauthorizedException('Неверный или просроченный код');

    await this.prisma.otpCode.update({ where: { id: otp.id }, data: { used: true } });

    let user = await this.prisma.user.findUnique({ where: { phone } });
    if (!user) {
      user = await this.prisma.user.create({ data: { phone } });
    }

    const token = this.jwt.sign(
      { sub: user.id, type: 'user' },
      { expiresIn: '24h' },
    );

    return {
      accessToken: token,
      user: {
        id: user.id,
        phone: user.phone,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    };
  }

  async adminLogin(login: string, password: string) {
    const admin = await this.prisma.adminUser.findUnique({ where: { login } });
    if (!admin) throw new UnauthorizedException('Неверные учётные данные');

    const valid = await bcrypt.compare(password, admin.passwordHash);
    if (!valid) throw new UnauthorizedException('Неверные учётные данные');

    const token = this.jwt.sign(
      { sub: admin.id, role: admin.role, type: 'admin' },
      { expiresIn: '24h' },
    );

    return {
      accessToken: token,
      admin: { id: admin.id, login: admin.login, role: admin.role },
    };
  }

  async requestSignOtp(loanId: string, phone: string): Promise<{ mockCode: string }> {
    const loan = await this.prisma.loan.findUnique({ where: { id: loanId } });
    if (!loan) throw new BadRequestException('Займ не найден');
    if (loan.status !== 'pending_signing')
      throw new BadRequestException('Займ не ожидает подписания');

    const code = String(Math.floor(100000 + Math.random() * 900000));
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await this.prisma.otpCode.create({
      data: { phone, code, purpose: 'sign_loan', loanId, expiresAt },
    });

    return { mockCode: code };
  }

  async verifySignOtp(loanId: string, code: string, phone: string): Promise<boolean> {
    const otp = await this.prisma.otpCode.findFirst({
      where: {
        loanId,
        phone,
        code,
        purpose: 'sign_loan',
        used: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!otp) throw new UnauthorizedException('Неверный или просроченный код подписания');
    await this.prisma.otpCode.update({ where: { id: otp.id }, data: { used: true } });
    return true;
  }
}
