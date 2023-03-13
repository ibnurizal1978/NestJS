import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoginModule } from './auth/login/login.module';
import { RegisterModule } from './auth/register/register.module';
import { UsersModule } from './users/users.module';
import { ProductsCategoriesModule } from './products_categories/products_categories.module';
import { ProductsModule } from './products/products.module';
import { LangModule } from './lang/lang.module';
import { LangTagsModule } from './lang_tags/lang_tags.module';
import { LangCategoriesModule } from './lang_categories/lang_categories.module';
import { GiftModule } from './gift/gift.module';
import { GiftQtyModule } from './gift_qty/gift_qty.module';
import { validationSchema } from 'config/validation';
import { configuration } from 'config/configuration';
const ORMConfig = require('../ormconfig');

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `${process.cwd()}/config/env/${process.env.NODE_ENV}.env`,
      isGlobal: true,
      load: [configuration],
      validationSchema: validationSchema,
    }),

    TypeOrmModule.forRoot(ORMConfig),
    LoginModule,
    RegisterModule,
    UsersModule,
    ProductsCategoriesModule,
    ProductsModule,
    LangModule,
    LangCategoriesModule,
    LangTagsModule,
    GiftModule,
    GiftQtyModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
