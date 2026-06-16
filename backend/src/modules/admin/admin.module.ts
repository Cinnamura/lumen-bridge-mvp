import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { ApplicationsModule } from '../applications/applications.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { LoansModule } from '../loans/loans.module';
import { RolesGuard } from '../../common/guards/roles.guard';

@Module({
  imports: [ApplicationsModule, NotificationsModule, LoansModule],
  controllers: [AdminController],
  providers: [RolesGuard],
})
export class AdminModule {}
