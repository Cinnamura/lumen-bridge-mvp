import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { ApplicationsModule } from '../applications/applications.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [ApplicationsModule, NotificationsModule],
  controllers: [AdminController],
})
export class AdminModule {}
