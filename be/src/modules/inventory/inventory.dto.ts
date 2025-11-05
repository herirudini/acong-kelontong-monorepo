import { IsDate, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class InventoryDto {
  @IsMongoId()
  @IsNotEmpty()
  purchase_item: Types.ObjectId;
  @IsNumber()
  @IsOptional()
  sell_price?: number;
  @IsNumber()
  @IsOptional()
  item_qty?: number;
  @IsNumber()
  @IsOptional()
  remaining_qty?: number;
  @IsString()
  @IsDate()
  @IsOptional()
  exp_date?: Date;
}
