import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
import * as bcrypt from 'bcrypt';
import { salts } from 'src/types/constants';
import { IEditUser, IPaginationRes } from 'src/types/interfaces';
import { BaseResponse } from 'src/utils/base-response';
import { GlobalService } from 'src/global/global.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private global: GlobalService
  ) { }

  async editUser(user_id: string, data: IEditUser): Promise<UserDocument | undefined> {
    const {
      first_name,
      last_name,
      email,
      modules,
      role
    } = data;
    const password = data.password ? await bcrypt.hash(data.password, salts) : undefined;
    try {
      console.log('data', data);
      const user = await this.userModel.findByIdAndUpdate(
        user_id,
        {
          $set: {
            first_name,
            last_name,
            email,
            password,
            modules,
            role
          }
        },
        {
          new: true,         // return the updated doc
          runValidators: true, // validate before saving
        },
      ).exec();
      return user || undefined;
    } catch (e) {
      return BaseResponse.unexpected({ err: { text: 'editUser', err: e.message } })
    }
  }

  async getListUser(
    page: number,
    size: number,
    sortBy?: string,
    sortDir: 'asc' | 'desc' = 'asc',
    search?: string,
    verified?: boolean,
  ): Promise<{ data: User[]; meta: IPaginationRes }> {
    const searchFields: string[] = ['first_name', 'last_name']; // ✅ Add searchable fields
    const filter = { column: 'verified', value: verified }

    return this.global.getList<User>(
      this.userModel,
      {
        page,
        size,
        sortBy,
        sortDir,
        search,
        searchFields,
        filter
      }
    )
  }

}
