import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateApplicationStatusDto {
  @IsIn(['in_review', 'approved', 'rejected'])
  status!: 'in_review' | 'approved' | 'rejected';

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  comment?: string;
}
