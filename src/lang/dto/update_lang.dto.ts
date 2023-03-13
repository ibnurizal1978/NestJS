import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateLangDto {
  @IsNotEmpty()
  @IsString()
  text: string;

  @IsNotEmpty()
  @IsString()
  lang_categories_id: string;

  @IsNotEmpty()
  @IsString()
  tags_id: string;
}
