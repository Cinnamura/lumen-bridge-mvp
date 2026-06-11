import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { ApplicationsModule } from '../applications/applications.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { LoansModule } from '../loans/loans.module';

@Module({
  imports: [ApplicationsModule, NotificationsModule, LoansModule],
  controllers: [AdminController],
})
export class AdminModule {}
