import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { LoansService } from './loans.service';
import { SignLoanDto } from './dto/sign-loan.dto';
import { JwtUserGuard } from '../../common/guards/jwt-user.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('cabinet/loans')
@UseGuards(JwtUserGuard)
export class LoansController {
  constructor(private loans: LoansService) {}

  @Get()
  list(@CurrentUser() user: { id: string }) {
    return this.loans.listForUser(user.id);
  }

  @Get(':id')
  get(@CurrentUser() user: { id: string }, @Param('id') id: string) {
    return this.loans.getForUser(user.id, id);
  }

  @Post(':id/sign/request')
  requestSign(@CurrentUser() user: { id: string }, @Param('id') id: string) {
    return this.loans.requestSignOtp(user.id, id);
  }

  @Post(':id/sign')
  sign(
    @CurrentUser() user: { id: string },
    @Param('id') id: string,
    @Body() dto: SignLoanDto,
    @Req() req: Request,
  ) {
    const ip =
      (req.headers['x-forwarded-for']?.toString().split(',')[0].trim()) ||
      req.ip ||
      req.socket?.remoteAddress ||
      undefined;
    const userAgent = req.headers['user-agent'];
    return this.loans.sign(user.id, id, dto.code, ip, userAgent);
  }
}
