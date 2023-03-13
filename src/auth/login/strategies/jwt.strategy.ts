import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginService } from '../login.service';
import { PassportStrategy } from '@nestjs/passport';
import { JwtPayload } from '../interfaces/jwt.payload';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly loginService: LoginService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.Authentication;
        },
      ]),
      secretOrKey: process.env.SECRET_KEY_JWT,
    });
  }

  async validate(payload: JwtPayload) {
    // console.log('test');
    if (payload.email) {
      const user = await this.loginService.validateUserByJwt(payload);

      if (!user) {
        throw new UnauthorizedException();
      }

      return user;
    }

    return;
  }
}
