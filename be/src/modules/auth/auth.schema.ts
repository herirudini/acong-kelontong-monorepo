// token-blacklist.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../user/user.schema';
import { addDays } from 'src/utils/helper';
import { sessionDays } from 'src/types/constants';

@Schema({ timestamps: true })
export class Auth {

    @Prop({ type: Types.ObjectId, ref: User.name, required: true })
    user_id: string; // Reference to Users collection
    @Prop()
    token: string;
    @Prop()
    user_agent: string;
    @Prop({ type: [String], ref: User.name, required: true })
    modules: string[];
    @Prop({ type: Date, default: addDays(new Date(), sessionDays) })
    expires_at?: Date;
    
}

export type AuthDocument = Auth & Document;
export const AuthSchema = SchemaFactory.createForClass(Auth);

// Add index for automatic cleanup (MongoDB TTL)
AuthSchema.index({ expires_at: 1 }, { expireAfterSeconds: 0 });
