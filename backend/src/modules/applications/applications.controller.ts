import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { JwtUserGuard } from '../../common/guards/jwt-user.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

/** Публичная подача заявки — авторизация не требуется */
@Controller('applications')
export class ApplicationsPublicController {
  constructor(private applications: ApplicationsService) {}

  @Post()
  create(@Body() dto: CreateApplicationDto) {
    return this.applications.create(dto);
  }
}

/** Заявки пользователя в личном кабинете */
@Controller('cabinet/applications')
@UseGuards(JwtUserGuard)
export class CabinetApplicationsController {
  constructor(private applications: ApplicationsService) {}

  @Get()
  list(@CurrentUser() user: { id: string }) {
    return this.applications.listForUser(user.id);
  }

  @Get(':id')
  get(@CurrentUser() user: { id: string }, @Param('id') id: string) {
    return this.applications.getForUser(user.id, id);
  }
}
