import { IsNotEmpty, IsNumber, IsOptional, Min, Max } from 'class-validator';

export class CreateReviewDto {
  @IsNumber()
  productId: number;

  @IsNumber()
  userId: number;

  @IsNotEmpty()
  comment: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating?: number;
}
