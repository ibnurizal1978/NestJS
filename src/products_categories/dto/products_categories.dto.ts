import {
  MaxLength,
  IsNotEmpty,
  IsEmail,
  IsString,
  IsBoolean,
} from 'class-validator';

export class ProductsCategoriesDto {

  @IsString()
  @IsNotEmpty()
  category_name: string;
}
