import { Module } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import {
  ApplicationsPublicController,
  CabinetApplicationsController,
} from './applications.controller';
import { NotificationsModule } from '../notifications/notifications.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [NotificationsModule, AuthModule],
  providers: [ApplicationsService],
  controllers: [ApplicationsPublicController, CabinetApplicationsController],
  exports: [ApplicationsService],
})
export class ApplicationsModule {}
