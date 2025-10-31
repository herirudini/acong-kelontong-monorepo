import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Supplier, SupplierDocument } from '../supplier/supplier.schema';
import { Product, ProductDocument } from '../product/product.schema';

export enum PurchasingEn {
  REQUEST = 'REQUEST',
  PROCESS = 'PROCESS',
  RECEIVE = 'RECEIVE',
  DROP = 'DROP',
}

// HEADER
@Schema({ timestamps: true })
export class Purchasing {
  @Prop({ type: Types.ObjectId, ref: Supplier.name, required: true })
  supplier: Types.ObjectId;

  @Prop({ required: true })
  supplier_name: string;

  @Prop({ type: Date })
  due_date: Date;

  @Prop({ default: PurchasingEn.REQUEST, enum: PurchasingEn })
  status?: PurchasingEn;

  @Prop({ type: Date })
  received_at?: Date;

  @Prop()
  invoice_number?: string;

  @Prop()
  invoice_photo?: string;

  @Prop({ type: Number, default: 0 })
  total_purchase_price: number;
}


export type PurchasingDocument = Purchasing & Document & { supplier: SupplierDocument };
export const PurchasingSchema = SchemaFactory.createForClass(Purchasing);

// ITEMS as BODY
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
  qty: number;

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