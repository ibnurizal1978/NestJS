import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateProductsDto {
  @IsNotEmpty()
  @IsString()
  category_name: string;

  @IsNotEmpty()
  @IsString()
  model: string;

  @IsNotEmpty()
  @IsString()
  description: string;
}
