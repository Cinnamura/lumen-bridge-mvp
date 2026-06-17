import { IsNumber, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';

export class RecordPaymentDto {
  @IsNumber()
  @Min(0.01)
  @Max(500000)
  amount!: number;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  note?: string;
}
