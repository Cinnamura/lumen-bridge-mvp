import { IsString, Matches } from 'class-validator';

export class RequestOtpDto {
  @IsString()
  @Matches(/^\+[1-9]\d{6,14}$/, { message: 'Телефон должен быть в формате E.164 (+353...)' })
  phone: string;
}
