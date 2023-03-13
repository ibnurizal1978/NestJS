import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegisterController } from './register.controller';
import { RegisterService } from './register.service';
import { UsersService } from '../../users/users.service';
import { Users } from '../../users/entities/users.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users]),
    JwtModule.register({
      secret: process.env.SECRET_KEY_JWT,
      signOptions: {
        expiresIn: 72000,
      },
    }),
  ],
  controllers: [RegisterController],
  providers: [RegisterService, UsersService],
})
export class RegisterModule {}
