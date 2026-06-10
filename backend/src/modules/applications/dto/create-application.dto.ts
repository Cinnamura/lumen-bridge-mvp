import {
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  Max,
  Matches,
  MinLength,
  MaxLength,
  IsEmail,
  ValidateIf,
} from 'class-validator';

export class CreateApplicationDto {
  @IsIn(['personal', 'business'])
  type!: 'personal' | 'business';

  @IsNumber()
  @Min(500)
  @Max(500000)
  amount!: number;

  @ValidateIf((o) => o.type === 'personal')
  @IsNumber()
  @Min(7)
  @Max(90)
  termDays?: number;

  @ValidateIf((o) => o.type === 'business')
  @IsNumber()
  @Min(1)
  @Max(12)
  termMonths?: number;

  @Matches(/^\+[1-9]\d{6,14}$/, { message: 'Телефон должен быть в формате E.164' })
  phone!: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  // personal
  @ValidateIf((o) => o.type === 'personal')
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  firstName?: string;

  @ValidateIf((o) => o.type === 'personal')
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  lastName?: string;

  @IsOptional()
  @IsString()
  dateOfBirth?: string;

  // business
  @ValidateIf((o) => o.type === 'business')
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  companyName?: string;

  @ValidateIf((o) => o.type === 'business')
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  regNumber?: string;

  @ValidateIf((o) => o.type === 'business')
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  repName?: string;

  @ValidateIf((o) => o.type === 'business')
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  repPosition?: string;
}
