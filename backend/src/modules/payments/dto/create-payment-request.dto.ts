import { IsNumber, IsString, IsUUID, Min, Max, MinLength, MaxLength } from 'class-validator';

export class CreatePaymentRequestDto {
  @IsUUID()
  loanId!: string;

  @IsNumber()
  @Min(0.01)
  @Max(500000)
  amount!: number;

  @IsString()
  @MinLength(2)
  @MaxLength(500)
  reference!: string;
}
