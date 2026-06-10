import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentRequestDto } from './dto/create-payment-request.dto';
import { JwtUserGuard } from '../../common/guards/jwt-user.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('cabinet/payment-requests')
@UseGuards(JwtUserGuard)
export class PaymentsController {
  constructor(private payments: PaymentsService) {}

  @Post()
  create(
    @CurrentUser() user: { id: string },
    @Body() dto: CreatePaymentRequestDto,
  ) {
    return this.payments.createRequest(user.id, dto);
  }

  @Get()
  list(@CurrentUser() user: { id: string }) {
    return this.payments.listForUser(user.id);
  }
}
