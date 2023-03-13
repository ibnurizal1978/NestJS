import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsCategories } from './entities/products_categories.entity';
import { ProductsCategoriesService } from './products_categories.service';
import { ProductsCategoriesController } from './products_categories.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductsCategories]),
    JwtModule.register({
      secret: process.env.SECRET_KEY_JWT,
      signOptions: {
        expiresIn: 72000,
      },
    }),
  ],
  controllers: [ProductsCategoriesController],
  providers: [ProductsCategoriesService],
})
export class ProductsCategoriesModule {}
