import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { isEmail } from 'class-validator';
import { Document, Types } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({
    type: String,
    unique: true,
    default: uuidv4,   // auto-generate UUID when creating a user
  })
  userId: string;       // <-- stable unique identifier for tokens

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true, validate: [isEmail, 'Invalid email'] })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  masterKey: string;

  @Prop({ default: false })
  isEmailConfirmed: boolean;

  @Prop({ type: [String], default: [] })
  modules: string[];

  @Prop({ required: true })
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Ensure virtuals are included in JSON
UserSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_, ret: { _id?: Types.ObjectId }) => {
    delete ret._id;   // hide Mongo’s _id
  },
});