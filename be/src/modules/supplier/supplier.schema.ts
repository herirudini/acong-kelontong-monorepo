import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Supplier {

  @Prop({ required: true, unique: true })
  supplier_name: string; // e.g. "PT Indofood Sukses Tbk"
  @Prop({ required: true })
  supplier_contact?: string;
  @Prop({ required: true })
  supplier_email?: string;

}

export type SupplierDocument = Supplier & Document;
export const SupplierSchema = SchemaFactory.createForClass(Supplier);