import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    masterKey: string,
    isEmailConfirmed: boolean,
    modules: string[],
    role: string,
  ): Promise<User> {
    const user = new this.userModel({
      firstName,
      lastName,
      email,
      password,
      masterKey,
      isEmailConfirmed,
      modules,
      role,
    });
    return user.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }
}
