import {
  MaxLength,
  IsNotEmpty,
  IsEmail,
  IsString,
  IsBoolean,
} from 'class-validator';

export class UserDto {
  @IsEmail()
  readonly email: string;

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

  @IsString()
  @IsNotEmpty()
  role: string;

  // @IsNotEmpty()
  @IsString()
  @MaxLength(60)
  password: string;
}
