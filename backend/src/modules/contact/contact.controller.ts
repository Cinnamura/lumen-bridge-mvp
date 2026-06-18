import { Body, Controller, Post } from '@nestjs/common';
import { CreateContactRequestDto } from './dto/create-contact-request.dto';

@Controller('contact-requests')
export class ContactController {
  @Post()
  create(@Body() dto: CreateContactRequestDto) {
    const ticketId = `CR-${Date.now().toString().slice(-8)}`;

    return {
      id: ticketId,
      status: 'accepted',
      receivedAt: new Date().toISOString(),
      attachment: dto.attachmentName
        ? {
            name: dto.attachmentName,
            type: dto.attachmentType ?? null,
            size: dto.attachmentSize ?? null,
          }
        : null,
      message: 'Запрос принят в учебном режиме. Команда поддержки свяжется с вами по указанным контактам.',
    };
  }
}
