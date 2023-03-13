import {
  MaxLength,
  IsNotEmpty,
  IsEmail,
  IsString,
  IsBoolean,
} from 'class-validator';

export class LangDto {

  @IsString()
  @IsNotEmpty()
  lang_categories_id: string;

  @IsString()
  @IsNotEmpty()
  tags_id: string;

  @IsString()
  @IsNotEmpty()
  text: string;
}
