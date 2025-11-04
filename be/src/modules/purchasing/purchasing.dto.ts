import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, IsDate, IsArray, IsOptional, IsMongoId } from 'class-validator';
import { Types } from 'mongoose';
import { PaginationDto } from 'src/global/global.dto';
import { PurchasingItemDto } from '../purchasing-item/purchasing-item.dto';
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
export class PurchasingDto extends PurchaseOrderDto {
  @IsMongoId() // ✅ checks it's a valid ObjectId string
  @IsNotEmpty()
  supplier?: Types.ObjectId;
  @IsString()
  @IsDate()
  @IsNotEmpty()
  due_date?: Date;
}

export class ListPurchasingItemsDTO extends PaginationDto {
  purchasing_id: Types.ObjectId
}