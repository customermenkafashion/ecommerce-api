import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';

export class CreateEventReviewDto {
  @IsNotEmpty()
  readonly eventId: string;

 @IsOptional()
  @IsString()
  userId?: number; 

  @IsNumber()
  readonly rating: number;

  @IsString()
  readonly review: string;
}
