import { Module } from '@nestjs/common';
import { LoansService } from './loans.service';
import { LoansController } from './loans.controller';
import { PaymentScheduleService } from './payment-schedule.service';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [NotificationsModule],
  providers: [LoansService, PaymentScheduleService],
  controllers: [LoansController],
  exports: [LoansService, PaymentScheduleService],
})
export class LoansModule {}
