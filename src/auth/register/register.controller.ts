import {
  Controller,
  Post,
  Body,
  Res,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { RegisterService } from './register.service';
import { RegisterUserDto } from './dto/register-user.dto';
import ConfirmEmailDto from './dto/confirm-email.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('auth/register')
export class RegisterController {
  constructor(private readonly registerService: RegisterService) {}

  @ApiTags('auth')
  @ApiOperation({ summary: 'API for user to register' })
  @Post()
  public async register(
    @Body() registerUserDto: RegisterUserDto,
  ): Promise<any> {
    try {
      return await this.registerService.register(registerUserDto);
    } catch (err) {
      throw new HttpException(
        { status: 400, message: 'Bad request' },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
