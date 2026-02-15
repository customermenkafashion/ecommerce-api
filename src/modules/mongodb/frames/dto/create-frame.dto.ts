import { IsEnum, IsNotEmpty, IsOptional, IsMongoId, IsNumber, IsString, Min } from 'class-validator';
import { FrameType } from '../entities/frame.schema';

export class CreateFrameDto {
  @IsNotEmpty()
  @IsMongoId()
  eventId: string; // the event this frame belongs to

  @IsNotEmpty()
  @IsEnum(FrameType)
  type: FrameType; // VIDEO, IMAGE, PRODUCT

  @IsOptional()
  @IsString()
  contentUrl?: string; // video or image URL (required for VIDEO/IMAGE)

  @IsOptional()
  @IsMongoId()
  productId?: string; // required only for PRODUCT frame

  @IsOptional()
  @IsNumber()
  @Min(0)
  timestamp?: number; // in seconds, optional

  @IsOptional()
  @IsString()
  description?: string; // optional description
}
