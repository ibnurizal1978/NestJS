import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ResendEmailDto {
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;
}
