import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateGiftDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}
