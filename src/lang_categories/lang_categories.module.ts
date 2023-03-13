import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LangCategories } from './entities/lang_categories.entity';
import { LangCategoriesService } from './lang_categories.service';
import { LangCategoriesController } from './lang_categories.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([LangCategories]),
    JwtModule.register({
      secret: process.env.SECRET_KEY_JWT,
      signOptions: {
        expiresIn: 72000,
      },
    }),
  ],
  controllers: [LangCategoriesController],
  providers: [LangCategoriesService],
})
export class LangCategoriesModule {}
