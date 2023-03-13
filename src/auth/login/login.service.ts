import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../users/users.service';
import { IUsers } from '../../users/interfaces/users.interface';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './interfaces/jwt.payload';
import { LoginDto } from './dto/login.dto';
import { Users } from 'src/users/entities/users.entity';
import { Response } from 'express';

@Injectable()
export class LoginService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  private async validate(loginDto: LoginDto): Promise<IUsers> {
    return await this.usersService.findByEmail(loginDto.email);
  }

  public async login(
    loginDto: LoginDto,
    response: Response,
  ): Promise<any | { status: number; message: string }> {
    return this.validate(loginDto)
      .then(async (userData) => {
        if (!userData) {
          throw new HttpException(
            {
              message: 'Authentication failed.',
              status: 400,
            },
            HttpStatus.BAD_REQUEST,
          );
        }

        const passwordIsValid = bcrypt.compareSync(
          loginDto.password,
          userData.password,
        );

        if (!passwordIsValid == true) {
          throw new HttpException(
            {
              message: 'Authentication failed.',
              status: 400,
            },
            HttpStatus.BAD_REQUEST,
          );
        }

        const user = await this.usersService.findByEmail(userData.email);

        const payload = {
          email: userData.email,
          id: userData.id,
        };

        const cookie = this.getCookieWithJwtToken(payload);

        response.setHeader('Set-Cookie', cookie);

        response.send({
          status: 200,
          userId: user.id,
        });
      })
      .catch((err) => {
        console.log(err);
        throw new HttpException(
          {
            message: 'Authentication failed.',
            status: 400,
          },
          HttpStatus.BAD_REQUEST,
        );
      });
  }

  public async validateUserByJwt(payload: JwtPayload) {
    // This will be used when the user has already logged in and has a JWT
    // console.log(payload);
    if (payload.email) {
      const user = await this.usersService.findByEmail(payload.email);

      if (!user) {
        throw new UnauthorizedException();
      }
      return this.createJwtPayload(user);
    }
    return;
  }

  protected createJwtPayload(user: Users) {
    const data: JwtPayload = {
      email: user.email,
    };

    const jwt = this.jwtService.sign(data, {
      secret: process.env.SECRET_KEY_JWT,
    });

    return {
      token: jwt,
      id: user.id,
      email: user.email,
      role: user.role,
    };
  }

  public getCookieWithJwtToken(payload) {
    const token = this.jwtService.sign(payload, {
      secret: process.env.SECRET_KEY_JWT,
    });

    // console.log(token);
    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${process.env.JWT_VERIFICATION_TOKEN_EXPIRATION_TIME}`;
  }
}
