import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';
import * as bcrypt from 'bcrypt';
import { SALTS } from 'src/types/constants';
@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) { }

  async create(data: User): Promise<User> {

    const user = new this.userModel({
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      password: await bcrypt.hash(data.password, SALTS),
      modules: data.modules,
      role: data.role,
    });
    return user.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }
}
