import { IsNotEmpty, IsNumber, IsMongoId } from 'class-validator';
import { Types } from 'mongoose';
import { InventoryEn } from './inventory.schema';

export class ReceiveOrderDto {
  @IsMongoId() // ✅ checks it's a valid ObjectId string
  @IsNotEmpty()
  purchase_item: Types.ObjectId;
  @IsNumber()
  sell_price: number;
  status: InventoryEn;
}

export class EditInventoryDto {
  @IsNumber()
  sell_price: number;
  @IsNumber()
  qty: number;
  @IsNumber()
  remaining_qty: number;
  status: InventoryEn;
}
