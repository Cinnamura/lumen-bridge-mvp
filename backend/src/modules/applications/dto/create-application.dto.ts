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
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateApplicationDto {
  @IsIn(['personal', 'business'])
  type!: 'personal' | 'business';

  @Type(() => Number)
  @IsNumber()
  @Min(500)
  @Max(500000)
  amount!: number;

  @ValidateIf((o) => o.type === 'personal')
  @Type(() => Number)
  @IsNumber()
  @Min(7)
  @Max(90)
  termDays?: number;

  @ValidateIf((o) => o.type === 'business')
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(12)
  termMonths?: number;

  @Matches(/^\+[1-9]\d{6,14}$/, { message: 'Телефон должен быть в формате E.164' })
  phone!: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(255)
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

  /**
   * dateOfBirth must be a valid ISO-8601 date string (YYYY-MM-DD).
   * Server-side we additionally reject years outside [1900, current year - 18]
   * to prevent both garbage dates and the year > 9999 crash.
   */
  @ValidateIf((o) => o.type === 'personal')
  @IsDateString({}, { message: 'Дата рождения должна быть в формате YYYY-MM-DD' })
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
