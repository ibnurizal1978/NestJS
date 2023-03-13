import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateLangCategoriesDto {
  @IsNotEmpty()
  @IsString()
  category_name: string;

  @IsNotEmpty()
  @IsString()
  url: string;

  @IsNotEmpty()
  @IsString()
  title: string;
}
