import { Module } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import {
  ApplicationsPublicController,
  CabinetApplicationsController,
  AdminApplicationsController,
} from './applications.controller';
import { NotificationsModule } from '../notifications/notifications.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [NotificationsModule, AuthModule],
  providers: [ApplicationsService],
  controllers: [
    ApplicationsPublicController,
    CabinetApplicationsController,
    AdminApplicationsController,
  ],
  exports: [ApplicationsService],
})
export class ApplicationsModule {}
