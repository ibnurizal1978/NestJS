import {
  MaxLength,
  IsNotEmpty,
  IsEmail,
  IsString,
  IsBoolean,
  IsNumber,
} from 'class-validator';

export class GiftQtyDto {

  @IsString()
  @IsNotEmpty()
  gift_id: string;

  @IsNumber()
  @IsNotEmpty()
  qty: number;

  @IsString()
  @IsNotEmpty()
  qty_action: string;
}
