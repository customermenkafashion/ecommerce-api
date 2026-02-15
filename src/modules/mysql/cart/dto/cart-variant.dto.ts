import { IsInt, Min } from "class-validator";

export class CartVariantDto {
  @IsInt()
  id: number;

  @IsInt()
  @Min(1)
  quantity: number;
}
