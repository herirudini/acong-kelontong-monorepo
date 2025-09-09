import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import type { TUOM } from 'src/types/interfaces';

@Schema({ timestamps: true })
export class Brand {
  @Prop({ required: true, unique: true })
  brand_code: string; // e.g. "BR123"

  @Prop({ required: true })
  brand_name: string; // e.g. "Coca Cola"

  @Prop({ required: true })
  unit_of_measure: TUOM; // enums [...'KG','L','PCS']

  @Prop({ unique: true, sparse: true }) 
  barcode?: string; // Optional, but must be unique if provided

  @Prop()
  description?: string;

  @Prop({ default: true })
  is_active: boolean;
}

export type BrandDocument = Brand & Document;
export const BrandSchema = SchemaFactory.createForClass(Brand);

// Add custom indexes if needed
BrandSchema.index({ brand_code: 1 });
