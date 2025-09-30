import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { modules } from 'src/types/constants';
import { TModules } from 'src/types/interfaces';

@Schema()
export class Role {
  @Prop({ required: true, unique: true })
  role_name: string;

  // Each role has a set of modules
  @Prop({
    type: [String],
    enum: modules,
    default: [],
  })
  modules: TModules[];

  @Prop({ default: true })
  active?: boolean;

}

export type RoleDocument = Role & Document;
export const RoleSchema = SchemaFactory.createForClass(Role);
