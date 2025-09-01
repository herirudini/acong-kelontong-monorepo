import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) { }

  async create(data: User): Promise<User> {

    const user = new this.userModel({
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      password: await bcrypt.hash(data.password, 10),
      modules: data.modules,
      role: data.role,
    });
    return user.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }
}
