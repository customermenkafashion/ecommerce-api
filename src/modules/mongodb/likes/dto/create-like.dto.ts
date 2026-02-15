import { IsMongoId, IsEnum, IsOptional, IsBoolean } from 'class-validator';
import { LikeTargetType } from '../enums/like-target-type.enum';

export class CreateLikeDto {
  @IsMongoId()
  targetId: string;

  @IsEnum(LikeTargetType)
  targetType: LikeTargetType;

  @IsOptional()
  @IsBoolean()
  isLike?: boolean;
}
