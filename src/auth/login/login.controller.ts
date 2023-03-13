import { Controller, Post, Body, Res } from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginDto } from './dto/login.dto';
import {
  ApiOperation,
  ApiProperty,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { LoginResponseDto } from './dto/login-response.dto';
import { Response } from 'express';

@Controller('auth/login')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @ApiTags('auth')
  @ApiOperation({ summary: 'API for login to site' })
  @ApiResponse({
    type: LoginResponseDto,
    status: 200,
    description: 'Success login',
  })
  @Post()
  public async login(
    @Body() loginDto: LoginDto,
    @Res() response: Response,
  ): Promise<any> {
    return await this.loginService.login(loginDto, response);
    // response.setHeader('Set-Cookie', data.cookie);
    // return {
    //   userId: data.userId,
    //   // user: payload,
    //   status: 200,
    // };
  }
}
