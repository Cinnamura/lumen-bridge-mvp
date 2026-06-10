import { Controller, Get, Patch, Param, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtUserGuard } from '../../common/guards/jwt-user.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('cabinet/notifications')
@UseGuards(JwtUserGuard)
export class NotificationsController {
  constructor(private notifications: NotificationsService) {}

  @Get()
  list(@CurrentUser() user: { id: string }) {
    return this.notifications.listForUser(user.id);
  }

  @Patch(':id/read')
  markRead(@CurrentUser() user: { id: string }, @Param('id') id: string) {
    return this.notifications.markRead(user.id, id);
  }
}
