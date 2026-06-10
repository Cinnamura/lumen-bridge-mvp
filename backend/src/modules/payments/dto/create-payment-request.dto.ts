import { IsNumber, IsString, IsUUID, Min, MinLength, MaxLength } from 'class-validator';

export class CreatePaymentRequestDto {
  @IsUUID()
  loanId!: string;

  @IsNumber()
  @Min(0.01)
  amount!: number;

  @IsString()
  @MinLength(2)
  @MaxLength(500)
  reference!: string;
}
