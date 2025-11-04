import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Product, ProductDocument } from '../product/product.schema';
import { Purchasing } from '../purchasing/purchasing.schema';

// PURCHASING ITEM as BODY
@Schema({ timestamps: true })
export class PurchasingItem {
  @Prop({ type: Types.ObjectId, ref: Purchasing.name, required: true, unique: true })
  purchase_order: Types.ObjectId; // ref to the HEADER, must be unique

  @Prop({ type: Types.ObjectId, ref: Product.name, required: true })
  product: Types.ObjectId;

  @Prop({ required: true })
  product_name: string;

  @Prop({ required: true })
  supplier_name: string;

  @Prop({ type: Number, required: true })
  purchase_qty: number;

  @Prop({ type: Number, required: true, default: 0 })
  recieved_qty: number;

  @Prop({ type: Number, required: true })
  purchase_price: number;

  @Prop({ type: Number, required: true })
  sell_price: number;

  @Prop({ type: Date })
  exp_date?: Date;
}

export type PurchasingItemDocument = PurchasingItem & Document & { product: ProductDocument };
export const PurchasingItemSchema = SchemaFactory.createForClass(PurchasingItem);