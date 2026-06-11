import { Controller, Post, Get, Body, HttpCode, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RequestOtpDto } from './dto/request-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { AdminLoginDto } from './dto/admin-login.dto';
import { JwtUserGuard } from '../../common/guards/jwt-user.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('otp/request')
  @HttpCode(200)
  requestOtp(@Body() dto: RequestOtpDto) {
    return this.authService.requestOtp(dto.phone);
  }

  @Post('otp/verify')
  @HttpCode(200)
  verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.authService.verifyOtp(dto.phone, dto.code);
  }

  @Post('admin/login')
  @HttpCode(200)
  adminLogin(@Body() dto: AdminLoginDto) {
    return this.authService.adminLogin(dto.login, dto.password);
  }

  /** Returns the authenticated user's profile from the database. */
  @Get('me')
  @UseGuards(JwtUserGuard)
  me(@CurrentUser() user: { id: string; phone: string; firstName: string | null; lastName: string | null; email: string | null }) {
    return {
      id:        user.id,
      phone:     user.phone,
      firstName: user.firstName ?? undefined,
      lastName:  user.lastName  ?? undefined,
      email:     user.email     ?? undefined,
    };
  }
}
