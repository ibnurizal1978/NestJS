import {
  MaxLength,
  IsNotEmpty,
  IsEmail,
  IsString,
  IsBoolean,
} from 'class-validator';

export class LangTagsDto {

  @IsString()
  @IsNotEmpty()
  tags: string;
}
