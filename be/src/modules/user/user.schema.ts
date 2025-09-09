import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { isEmail } from 'class-validator';
import { Document } from 'mongoose';
import { sessionDays } from 'src/types/constants';
import { addDays } from 'src/utils/helper';
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

  @Prop({ default: false })
  verified?: boolean;

  @Prop({ type: [String], default: [] })
  modules: string[];

  @Prop({ required: true })
  role: string;

  @Prop({ type: Date, default: addDays(new Date(), sessionDays) })
  verify_due_time?: Date;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
// Add index for automatic cleanup (MongoDB TTL)
UserSchema.index(
  { verify_due_time: 1 },
  { expireAfterSeconds: 0, partialFilterExpression: { verified: false } }
);
