import { IsNotEmpty, IsDate, IsNumber, IsOptional, IsMongoId } from 'class-validator';
import { Types } from 'mongoose';
export class PurchasOrderItemDto {
  @IsOptional()
  @IsNumber()
  recieved_qty?: number;
  @IsDate()
  exp_date?: Date;
  @IsNumber()
  sell_price?: number;
}
export class PurchasingItemDto extends PurchasOrderItemDto {
  @IsMongoId() // ✅ checks it's a valid ObjectId string
  @IsNotEmpty()
  purchase_order: Types.ObjectId;
  @IsMongoId() // ✅ checks it's a valid ObjectId string
  @IsNotEmpty()
  product: Types.ObjectId;
  @IsNumber()
  purchase_qty: number;
  @IsNumber()
  purchase_price: number;
}
