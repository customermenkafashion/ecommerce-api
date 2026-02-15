import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsObject,
  IsOptional,
  IsArray,
  ValidateNested,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

class VariantAttributeDto {
  @IsString()
  @IsNotEmpty()
  key: string;

  @IsString()
  @IsNotEmpty()
  value: string;
}

export class CreateVariantDto {
  // 🆔 SKU
  @IsString()
  @IsNotEmpty()
  sku: string;

  // 🎨 Attributes (color, size, etc.)
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VariantAttributeDto)
  attributes: VariantAttributeDto[];

  // 💰 Price
  @IsNumber()
  @IsPositive()
  price: number;

  // 📦 Quantity
  @IsNumber()
  @Min(0)
  quantity: number;

  // 💸 Optional discount
  @IsOptional()
  @IsNumber()
  @Min(0)
  discountedPrice?: number;

  // 💱 Currency (optional)
  @IsOptional()
  @IsString()
  currency?: string;
}
