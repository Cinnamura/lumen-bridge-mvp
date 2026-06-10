import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationStatusDto } from './dto/update-application-status.dto';
import { JwtUserGuard } from '../../common/guards/jwt-user.guard';
import { JwtAdminGuard } from '../../common/guards/jwt-admin.guard';
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

/** Управление заявками оператором/администратором */
@Controller('admin/applications')
@UseGuards(JwtAdminGuard)
export class AdminApplicationsController {
  constructor(private applications: ApplicationsService) {}

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateApplicationStatusDto,
  ) {
    return this.applications.updateStatus(id, dto.status, dto.comment);
  }
}
