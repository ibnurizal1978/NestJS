import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LangTags } from './entities/lang_tags.entity';
import { LangTagsService } from './lang_tags.service';
import { LangTagsController } from './lang_tags.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([LangTags]),
    JwtModule.register({
      secret: process.env.SECRET_KEY_JWT,
      signOptions: {
        expiresIn: 72000,
      },
    }),
  ],
  controllers: [LangTagsController],
  providers: [LangTagsService],
})
export class LangTagsModule {}
