import {
  IsBoolean,
  IsOptional,
  IsString,
  Length,
  IsInt,
} from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @Length(2, 100)
  name: string;

  @IsOptional()
  @IsString()
  @Length(2, 120)
  slug?: string;

  @IsOptional()
  @IsString()
  @Length(0, 255)
  description?: string;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean = true;

  // For parent → child category support
  @IsOptional()
  @IsInt()
  parent_id?: number;
}
