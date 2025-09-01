import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { isEmail } from 'class-validator';
import { Document } from 'mongoose';
@Schema()
export class User {

  @Prop({ required: true })
  first_name: string;

  @Prop({ required: true })
  last_name: string;

  @Prop({ required: true, unique: true, validate: [isEmail, 'Invalid email'] })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  master_key?: string;

  @Prop({ type: [String], default: [] })
  modules: string[];

  @Prop({ required: true })
  role: string;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);