import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
import * as bcrypt from 'bcrypt';
import { SALTS } from 'src/types/constants';
@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) { }

  async create(data: User): Promise<UserDocument> {

    const user = new this.userModel({
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      password: data.password ? await bcrypt.hash(data.password, SALTS) : undefined,
      modules: data.modules,
      role: data.role,
    });
    return user.save();
  }

  async findAll(): Promise<UserDocument[]> {
    return this.userModel.find().exec();
  }
}
