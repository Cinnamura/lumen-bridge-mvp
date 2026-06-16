import { IsIn, IsOptional, IsString, Length, Matches } from 'class-validator';

export class UpdateAdminUserDto {
  @IsOptional()
  @IsString()
  @Length(3, 100)
  @Matches(/^[a-zA-Z0-9._-]+$/)
  login?: string;

  @IsOptional()
  @IsString()
  @Length(6, 100)
  password?: string;

  @IsOptional()
  @IsIn(['admin', 'operator'])
  role?: 'admin' | 'operator';
}
