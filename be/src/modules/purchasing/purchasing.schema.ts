import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Supplier, SupplierDocument } from '../supplier/supplier.schema';

export enum PurchasingEn {
  REQUEST = 'REQUEST',
  PROCESS = 'PROCESS',
  RECEIVE = 'RECEIVE',
  DROP = 'DROP',
}

// PURCHASING as HEADER
@Schema({ timestamps: true })
export class Purchasing {
  @Prop({ type: Types.ObjectId, ref: Supplier.name, required: true })
  supplier: Types.ObjectId;

  @Prop({ required: true })
  supplier_name: string;

  @Prop({ type: Date })
  due_date?: Date;

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