import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../../shared/shared-user/user.schema';
import * as bcrypt from 'bcrypt';
import { salts } from 'src/types/constants';
interface IEditUser {
  first_name?: string;
  last_name?: string;
  email?: string;
  password?: string;
  modules?: string[];
  role?: string;
}
@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) { }

  async editUser(user_id: string, data: IEditUser): Promise<UserDocument | null> {
    const {
      first_name,
      last_name,
      email,
      modules,
      role
    } = data;
    const password = data.password ? await bcrypt.hash(data.password, salts) : undefined;

    const user = this.userModel.findByIdAndUpdate(user_id, {
      first_name,
      last_name,
      email,
      password,
      modules,
      role
    });
    return user;
  }

  async findAll(): Promise<UserDocument[]> {
    return this.userModel.find().exec();
  }
}
