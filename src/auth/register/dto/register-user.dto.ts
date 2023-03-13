import { MaxLength, IsNotEmpty, IsEmail, IsString } from 'class-validator';

export class RegisterUserDto {
  @IsString()
  readonly company: string;

  @IsNotEmpty()
  @IsString()
  readonly first_name: string;

  @IsNotEmpty()
  @IsString()
  readonly last_name: string;

  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  readonly role: string;

  @IsNotEmpty()
  @IsString()
  readonly country: string;

  // @IsNotEmpty()
  @IsString()
  @MaxLength(60)
  password: string;
}
