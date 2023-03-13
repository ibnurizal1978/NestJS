import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateProductsCategoriesDto {
  @IsNotEmpty()
  @IsString()
  category_name: string;
}
