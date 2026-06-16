import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateApplicationCommentDto {
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  comment?: string;
}
