import {
  MaxLength,
  IsNotEmpty,
  IsEmail,
  IsString,
  IsBoolean,
} from 'class-validator';

export class LangCategoriesDto {

  @IsString()
  @IsNotEmpty()
  category_name: string;

  @IsString()
  @IsNotEmpty()
  url: string;

  @IsString()
  @IsNotEmpty()
  title: string;
}
