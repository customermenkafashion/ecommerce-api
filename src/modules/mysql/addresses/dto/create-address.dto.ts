import { IsBoolean, IsOptional, IsString, Length } from 'class-validator';

export class CreateAddressDto {
  @IsString()
  @Length(1, 255)
  address_line_1: string;

  @IsOptional()
  @IsString()
  @Length(1, 255)
  address_line_2?: string;

  @IsString()
  city: string;

  @IsString()
  state: string;

  @IsString()
  pincode: string;

  @IsString()
  country: string;

  // ✅ ADD THIS
  @IsOptional()
  @IsBoolean()
  is_default?: boolean;
}
