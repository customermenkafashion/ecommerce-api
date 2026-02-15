
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
  MinLength
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateProductDto {

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  title?: string;
  
  @IsNotEmpty()
  @IsString()
  description?: string;
}





