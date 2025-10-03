import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Brand {

  @Prop({ required: true, unique: true })
  brand_name: string; // e.g. "Indomie"

  @Prop()
  description?: string;

}

export type BrandDocument = Brand & Document;
export const BrandSchema = SchemaFactory.createForClass(Brand);