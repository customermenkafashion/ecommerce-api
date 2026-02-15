import {
  IsInt,
  IsArray,
  ArrayMinSize,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";
import { CartVariantDto } from "./cart-variant.dto";

export class CartProductDto {
  @IsInt()
  id: number; // product id

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CartVariantDto)
  variants: CartVariantDto[];
}
