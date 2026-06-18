import { IsBoolean, IsEmail, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class CreateContactRequestDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  firstName!: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  lastName?: string;

  @IsEmail()
  @MaxLength(255)
  email!: string;

  @IsOptional()
  @Matches(/^\+[1-9]\d{6,14}$/, { message: 'Телефон должен быть в формате E.164' })
  phone?: string;

  @IsString()
  @MinLength(10)
  @MaxLength(5000)
  message!: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  attachmentName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  attachmentType?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  attachmentSize?: string;

  @IsBoolean()
  consent!: boolean;
}
