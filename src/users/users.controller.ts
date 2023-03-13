import { Controller, Body, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiTags('user')
  @ApiOperation({ summary: 'API for update user password' })
  @Post('/update-password')
  async updatePassword(@Body() payload: UpdatePasswordDto) {
    return this.usersService.updateByPassword(payload.token, payload.password);
  }

  @ApiTags('user')
  @ApiOperation({ summary: 'API for send email forgot password' })
  @Post('/forgot-password')
  async forgotPassword(@Body() email: ForgotPasswordDto) {
    return this.usersService.forgotPassword(email.email);
  }
}
