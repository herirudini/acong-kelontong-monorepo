import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Purchasing, PurchasingItemDocument } from '../purchasing/purchasing.schema';
import { Product } from '../product/product.schema';

export enum InventoryEn {
  HALT = 'HALT',
  SELL = 'SELL',
  RECALL = 'RECALL',
}

@Schema({ timestamps: true })
export class Inventory {
  @Prop({ type: Types.ObjectId, ref: Purchasing.name }) purchase_item: Types.ObjectId;
  @Prop({ required: true })
  supplier_name: string;

  @Prop({ type: Types.ObjectId, ref: Product.name, required: true }) product: Types.ObjectId;
  @Prop({ required: true })
  product_name: string;

  @Prop() exp_date?: Date;
  @Prop({ type: Number, required: true }) purchase_price: number;

  @Prop({ type: Number, required: true }) sell_price: number;
  @Prop({ type: Number, required: true }) qty: number;
  @Prop({ type: Number, required: true }) remaining_qty: number;

  @Prop() batch_code?: string;
  @Prop({ default: InventoryEn.HALT, enum: InventoryEn })
  status: InventoryEn;
}

export type InventoryDocument = Inventory & Document & { purchase_item: PurchasingItemDocument };
export const InventorySchema = SchemaFactory.createForClass(Inventory);