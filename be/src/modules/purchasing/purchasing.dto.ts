import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, IsDate, IsNumber, IsArray, IsBase64, IsOptional } from 'class-validator';
import { PaginationDto } from 'src/global/global.dto';

export class PurchasingItemDto {
  @IsString()
  @IsNotEmpty()
  purchase_order: string;
  @IsString()
  @IsNotEmpty()
  product: string;
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
  @IsString()
  @IsNotEmpty()
  supplier: string;
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