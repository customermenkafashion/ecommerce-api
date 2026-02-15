import {
  IsArray,
  ArrayMinSize,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";
import { CartProductDto } from "./cart-product.dto";

export class CreateCartDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CartProductDto)
  cart: CartProductDto[];
}
