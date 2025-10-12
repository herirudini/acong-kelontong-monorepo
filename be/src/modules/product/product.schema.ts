import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Brand, BrandDocument } from '../brand/brand.schema';

@Schema({ timestamps: true })
export class Product {

  @Prop({ required: true, unique: true })
  product_name: string; // e.g. "PT Indofood Sukses Tbk"
  @Prop()
  product_description?: string;
  @Prop()
  unit_of_measure?: string;
  @Prop()
  barcode?: string;
  @Prop({ type: Types.ObjectId, ref: Brand.name, required: true })
  brand: Types.ObjectId;
}

export type ProductDocument = Product & Document & { brand: BrandDocument };
export const ProductSchema = SchemaFactory.createForClass(Product);