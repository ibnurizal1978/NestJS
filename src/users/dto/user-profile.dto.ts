import { MaxLength, IsNotEmpty, IsEmail, IsString } from 'class-validator';

export class UserProfileDto {
  @IsString()
  @IsNotEmpty()
  mobile: string;

  @IsString()
  @IsNotEmpty()
  first_name: string;

  @IsString()
  @IsNotEmpty()
  last_name: string;

  @IsString()
  @IsNotEmpty()
  company: string;

  @IsString()
  @IsNotEmpty()
  country: string;
}
