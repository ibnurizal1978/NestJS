import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateLangTagsDto {
  @IsNotEmpty()
  @IsString()
  tags: string;
}
