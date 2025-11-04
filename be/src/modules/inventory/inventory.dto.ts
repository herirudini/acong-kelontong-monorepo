import { IsNumber } from 'class-validator';
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
