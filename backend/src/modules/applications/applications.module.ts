import { Module } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import {
  ApplicationsPublicController,
  CabinetApplicationsController,
  AdminApplicationsController,
} from './applications.controller';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [NotificationsModule],
  providers: [ApplicationsService],
  controllers: [
    ApplicationsPublicController,
    CabinetApplicationsController,
    AdminApplicationsController,
  ],
  exports: [ApplicationsService],
})
export class ApplicationsModule {}
