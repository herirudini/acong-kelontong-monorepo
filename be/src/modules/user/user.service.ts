import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
import * as bcrypt from 'bcrypt';
import { salts, sessionDays } from 'src/types/constants';
import { IEditUser, IPaginationRes, TmpUser } from 'src/types/interfaces';
import { BaseResponse } from 'src/utils/base-response';
import { GlobalService } from 'src/global/global.service';
import { generateRandomToken, addDays, decodeBase64 } from 'src/utils/helper';

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

  async resendVerification(email: string): Promise<{ tmpUser: TmpUser, tmpPassword: string }> {
    const tmpUser = await this.userModel.findOne({ email });
    if (!tmpUser) {
      return BaseResponse.notFound({ err: 'resendVerification tmpUser not found' });
    }
    // generate raw random password
    const tmpPassword = generateRandomToken()
    // hash temporary random password
    const password = await bcrypt.hash(tmpPassword, salts);
    tmpUser.password = password;
    tmpUser.verified = false;
    tmpUser.verify_due_time = addDays(new Date(), sessionDays);
    await tmpUser.save();
    return { tmpUser, tmpPassword } as unknown as { tmpUser: TmpUser, tmpPassword: string };
  }

  async inviteUser(body: User): Promise<{ tmpUser: TmpUser, tmpPassword: string }> {
    const role = body.role.toLowerCase();
    const first_name = body.first_name;
    const last_name = body.last_name;
    const email = body.email;
    const modules = body.modules;
    const exist = await this.userModel.findOne({ email });
    if (exist) {
      return BaseResponse.forbidden({ err: 'inviteUser exist' });
    }
    // generate raw random password
    const tmpPassword = generateRandomToken()
    // hash temporary random password
    const password = await bcrypt.hash(tmpPassword, salts);
    const tmpUser = await this.userModel.create({
      first_name,
      last_name,
      email,
      role,
      password,
      modules,
      verified: false,
    });

    return { tmpUser, tmpPassword } as unknown as { tmpUser: TmpUser, tmpPassword: string };
  }

  async verifyUser(tmpPassword: string, newPassword: string): Promise<boolean> {
    const base64 = decodeBase64(tmpPassword);
    const ticket = JSON.parse(base64);
    const tokenDoc = await this.userModel.findById(ticket.pass1);
    if (!tokenDoc) return false;
    const isValid = await bcrypt.compare(ticket.pass2, tokenDoc.password);
    if (!isValid) return false;
    // mark as verified
    tokenDoc.password = await bcrypt.hash(newPassword, salts);
    tokenDoc.verified = true;
    await tokenDoc.save();
    return true;
  }

  getPermissions() {
    return [
      'cashier.view', 'cashier.create', 'cashier.edit', 'cashier.delete',
      'products.view', 'products.create', 'products.edit', 'products.delete',
      'brands.view', 'brands.create', 'brands.edit', 'brands.delete',
      'suppliers.view', 'suppliers.create', 'suppliers.edit', 'suppliers.delete',
      'income.view', 'income.create', 'income.edit', 'income.delete',
      'expenses.view', 'expenses.create', 'expenses.edit', 'expenses.delete',
      'users.view', 'users.create', 'users.edit', 'users.delete',
    ]
  }

}
