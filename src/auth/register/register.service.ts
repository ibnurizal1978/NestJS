import {
  BadRequestException,
  Injectable,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from '../../users/users.service';
import * as bcrypt from 'bcrypt';
import { RegisterUserDto } from './dto/register-user.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../login/interfaces/jwt.payload';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RegisterService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  public async register(registerUserDto: RegisterUserDto) {
    try {
      registerUserDto.password = bcrypt.hashSync(registerUserDto.password, 8);

      const data = await this.usersService.create(registerUserDto);

      const payload: JwtPayload = { email: data.email };
      const token = this.jwtService.sign(payload, {
        secret: this.configService.get('SECRET_KEY_JWT'),
        expiresIn: `${this.configService.get(
          'JWT_VERIFICATION_TOKEN_EXPIRATION_TIME',
        )}s`,
      });

      return {
        message: 'Success!',
        accessToken: token,
        status: 200,
      };
    } catch (err) {
      console.log(err);
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  public async decodeConfirmationToken(token: string) {
    try {
      const payload = await this.jwtService.verify(token, {
        secret: this.configService.get('JWT_VERIFICATION_TOKEN_SECRET'),
      });

      if (typeof payload === 'object' && 'email' in payload) {
        return payload.email;
      }
      throw new BadRequestException();
    } catch (error) {
      if (error?.name === 'TokenExpiredError') {
        throw new BadRequestException('Email confirmation token expired');
      }
      throw new BadRequestException('Bad confirmation token');
    }
  }
}
