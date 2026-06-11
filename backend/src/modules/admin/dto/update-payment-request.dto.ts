import { IsIn } from 'class-validator';

export class UpdatePaymentRequestDto {
  @IsIn(['confirmed', 'rejected'])
  status!: 'confirmed' | 'rejected';
}
