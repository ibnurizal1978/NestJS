import { Module } from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginController } from './login.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../../users/entities/users.entity';
import { JwtModule } from '@nestjs/jwt';
import { UsersService } from '../../users/users.service';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users]),
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    JwtModule.register({
      secret: process.env.SECRET_KEY_JWT,
      signOptions: {
        expiresIn: 72000,
      },
    }),
  ],
  providers: [LoginService, UsersService, JwtStrategy],
  controllers: [LoginController],
})
export class LoginModule {}
