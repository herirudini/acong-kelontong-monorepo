import { IsNotEmpty, IsDate, IsNumber, IsOptional, IsMongoId } from 'class-validator';
import { Types } from 'mongoose';
import { InventoryEn } from '../inventory/inventory.schema';

export class PurchasingItemDto {
  @IsMongoId() // ✅ checks it's a valid ObjectId string
  @IsNotEmpty()
  purchase_order: Types.ObjectId;
  @IsMongoId() // ✅ checks it's a valid ObjectId string
  @IsNotEmpty()
  product: Types.ObjectId;
  @IsDate()
  exp_date: string;
  @IsNumber()
  purchase_qty: number;
  @IsOptional()
  @IsNumber()
  recieved_qty?: number;
  @IsNumber()
  purchase_price: number;
  @IsNumber()
  sell_price: number;
}

export class ReceiveOrderItemDto {
  @IsMongoId() // ✅ checks it's a valid ObjectId string
  @IsNotEmpty()
  purchase_item: Types.ObjectId;
  @IsNumber()
  status?: InventoryEn;
}