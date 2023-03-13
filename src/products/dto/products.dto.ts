import {
  MaxLength,
  IsNotEmpty,
  IsEmail,
  IsString,
  IsBoolean,
} from 'class-validator';

export class ProductsDto {

  @IsString()
  @IsNotEmpty()
  category_name: string;

  @IsString()
  @IsNotEmpty()
  model: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}
