import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lang } from './entities/lang.entity';
import { LangService } from './lang.service';
import { LangController } from './lang.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([Lang]),
    JwtModule.register({
      secret: process.env.SECRET_KEY_JWT,
      signOptions: {
        expiresIn: 72000,
      },
    }),
  ],
  controllers: [LangController],
  providers: [LangService],
})
export class LangModule {}
