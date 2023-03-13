import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GiftQty } from './entities/gift_qty.entity';
import { GiftQtyService } from './gift_qty.service';
import { GiftQtyController } from './gift_qty.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([GiftQty]),
    JwtModule.register({
      secret: process.env.SECRET_KEY_JWT,
      signOptions: {
        expiresIn: 72000,
      },
    }),
  ],
  controllers: [GiftQtyController],
  providers: [GiftQtyService],
})
export class GiftQtyModule {}
