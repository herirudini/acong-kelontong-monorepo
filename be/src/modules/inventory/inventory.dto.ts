import { IsNotEmpty, IsNumber, IsMongoId } from 'class-validator';
import { Types } from 'mongoose';
import { InventoryEn } from './inventory.schema';

export class EditInventoryDto {
  @IsNumber()
  sell_price: number;
  @IsNumber()
  qty: number;
  @IsNumber()
  remaining_qty: number;
  status: InventoryEn;
}
