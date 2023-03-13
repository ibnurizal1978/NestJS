import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateGiftQtyDto {
  @IsNotEmpty()
  @IsNumber()
  qty: number;

  @IsNotEmpty()
  @IsString()
  qty_action: string;
}
