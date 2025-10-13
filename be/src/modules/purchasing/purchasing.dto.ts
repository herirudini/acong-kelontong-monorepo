import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, IsDate, IsNumber, IsArray, IsOptional, IsMongoId } from 'class-validator';
import { Types } from 'mongoose';
import { PaginationDto } from 'src/global/global.dto';

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
  qty: number;
  @IsNumber()
  purchase_price: number;
}

export class PurchasingMutationDTO extends PaginationDto {
  @IsMongoId() // ✅ checks it's a valid ObjectId string
  @IsNotEmpty()
  supplier: Types.ObjectId;
  @IsString()
  @IsNotEmpty()
  supplier_name: string;
  @IsString()
  @IsNotEmpty()
  type: string;
  @IsDate()
  @IsNotEmpty()
  due_date: Date;
  @IsString()
  @IsNotEmpty()
  status: string;
  @IsString()
  invoice_number: string;
  @IsNumber()
  total_purchase_price: number;
  @IsArray()
  @Type(() => PurchasingItemDto)
  purchase_item: PurchasingItemDto[];
  @IsOptional()
  @IsString()
  invoice_photo?: string;
}

export class ListPurchasingItemsDTO extends PaginationDto {
  purchasing_id: Types.ObjectId
}