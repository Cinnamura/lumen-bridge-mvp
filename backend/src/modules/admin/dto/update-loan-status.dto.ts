import { IsIn } from 'class-validator';

export class UpdateLoanStatusDto {
  @IsIn(['active', 'overdue', 'closed'])
  status!: 'active' | 'overdue' | 'closed';
}
