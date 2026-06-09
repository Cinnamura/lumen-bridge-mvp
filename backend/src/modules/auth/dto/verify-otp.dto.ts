import { IsString, Length, Matches } from 'class-validator';

export class VerifyOtpDto {
  @IsString()
  @Matches(/^\+[1-9]\d{6,14}$/, { message: 'Телефон должен быть в формате E.164' })
  phone: string;

  @IsString()
  @Length(6, 6, { message: 'Код должен состоять из 6 цифр' })
  code: string;
}
