import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, IsDate, IsNumber, IsArray, IsOptional, IsMongoId } from 'class-validator';
import { Types } from 'mongoose';
import { PaginationDto } from 'src/global/global.dto';
import { InventoryEn } from '../inventory/inventory.schema';

export class PurchasingItemDto {
  @IsMongoId() // ✅ checks it's a valid ObjectId string
  @IsNotEmpty()
  purchase_order: Types.ObjectId;
  @IsMongoId() // ✅ checks it's a valid ObjectId string
  @IsNotEmpty()
  product: Types.ObjectId;
  @IsString()
  @IsNotEmpty()
  supplier_name: string;
  @IsString()
  @IsNotEmpty()
  product_name: string;
  @IsDate()
  exp_date: string;
  @IsNumber()
  purchase_qty: number;
  @IsNumber()
  recieved_qty: number;
  @IsNumber()
  purchase_price: number;
  @IsNumber()
  sell_price: number;
}
export class PurchasingDto extends PaginationDto {
  @IsMongoId() // ✅ checks it's a valid ObjectId string
  @IsNotEmpty()
  supplier?: Types.ObjectId;
  @IsString()
  @IsNotEmpty()
  supplier_name?: string;
  @IsDate()
  @IsNotEmpty()
  due_date?: Date;
  @IsString()
  invoice_number?: string;
  @IsNumber()
  total_purchase_price?: number;
  @IsArray()
  @Type(() => PurchasingItemDto)
  purchase_item?: PurchasingItemDto[];
  @IsOptional()
  @IsString()
  invoice_photo?: string;
}
export class PurchaseOrderDto {
  @IsOptional()
  @IsString()
  invoice_number?: string;
  @IsOptional()
  @IsString()
  invoice_photo?: string;
  @IsArray()
  @Type(() => PurchasingItemDto)
  purchase_item: PurchasingItemDto[];
}
export class ReceiveOrderItemDto {
  @IsMongoId() // ✅ checks it's a valid ObjectId string
  @IsNotEmpty()
  purchase_item: Types.ObjectId;
  @IsNumber()
  status?: InventoryEn;
}

export class ListPurchasingItemsDTO extends PaginationDto {
  purchasing_id: Types.ObjectId
}