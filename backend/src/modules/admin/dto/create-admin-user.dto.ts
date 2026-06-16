import { IsIn, IsString, Length, Matches } from 'class-validator';

export class CreateAdminUserDto {
  @IsString()
  @Length(3, 100)
  @Matches(/^[a-zA-Z0-9._-]+$/)
  login!: string;

  @IsString()
  @Length(6, 100)
  password!: string;

  @IsIn(['admin', 'operator'])
  role!: 'admin' | 'operator';
}
