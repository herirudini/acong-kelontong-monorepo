import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from './user.schema';
import * as bcrypt from 'bcrypt';
import { modules, salts, sessionDays } from 'src/types/constants';
import { IEditUser, IPaginationRes, TmpUser } from 'src/types/interfaces';
import { BaseResponse } from 'src/utils/base-response';
import { GlobalService } from 'src/global/global.service';
import { generateRandomToken, addDays, decodeBase64 } from 'src/utils/helper';
import { InviteUserDto } from './user.dto';
import { RoleService } from '../role/role.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    private roleService: RoleService,
    private global: GlobalService
  ) { }

  async getDetailUser(user_id: string): Promise<UserDocument | undefined> {
    const user = await this.userModel.findById(user_id).populate('role').exec();
    return user || undefined;
  }

  async editUser(user_id: string, data: IEditUser): Promise<UserDocument | undefined> {
    const {
      first_name,
      last_name,
      email,
      role
    } = data;
    let roleId: Types.ObjectId | null | undefined;
    if (role) {
      const findRole = await this.roleService.getDetailRole(role);
      if (!findRole) {
        return BaseResponse.notFound({ err: 'editUser !findRole' });
      }
      roleId = findRole._id as Types.ObjectId;
    } else {
      roleId = null; // explicit clear
    }
    const password = data.password ? await bcrypt.hash(data.password, salts) : undefined;
    try {
      const updateData: Partial<User> = {};
      if (first_name) {
        updateData.first_name = first_name;
      }
      if (last_name) {
        updateData.last_name = last_name;
      }
      if (email) {
        updateData.email = email
      }
      if (password) {
        updateData.password = password;
      }
      if (roleId) {
        updateData.role = roleId;
      }
      const user = await this.userModel.findByIdAndUpdate(
        user_id,
        { $set: updateData },
        {
          new: true,
          runValidators: true,
        },
      ).populate('role').exec();

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
    verified?: boolean
  ): Promise<{ data: User[]; meta: IPaginationRes }> {
    const searchFields: string[] = ['first_name', 'last_name']; // ✅ Add searchable fields
    const filter = { column: 'verified', value: verified };
    const populate = { column: 'role' };

    return this.global.getList<User, UserDocument>(
      this.userModel,
      {
        page,
        size,
        sortBy,
        sortDir,
        search,
        searchFields,
        filter,
        populate
      }
    )
  }

  async resendVerification(user_id: string): Promise<{ tmpUser: TmpUser, tmpPassword: string }> {
    const tmpUser = await this.userModel.findById(user_id).populate('role').exec();;
    if (!tmpUser) {
      return BaseResponse.notFound({ err: 'resendVerification tmpUser not found' });
    }
    if (tmpUser.verified) {
      return BaseResponse.forbidden({ err: 'resendVerification tmpUser already verified' });
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

  async inviteUser(body: InviteUserDto): Promise<{ tmpUser: TmpUser, tmpPassword: string }> {
    const findRole = await this.roleService.getDetailRole(body.role)
    if (!findRole) return BaseResponse.notFound({ err: 'inviteUser !findRole' });
    const role = findRole._id;
    const first_name = body.first_name;
    const last_name = body.last_name;
    const email = body.email;
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
      verified: false,
    });

    return { tmpUser, tmpPassword } as unknown as { tmpUser: TmpUser, tmpPassword: string };
  }

  async verifyUser(encryptedTicket: string, newPassword: string): Promise<boolean> {
    const base64 = decodeBase64(encryptedTicket);
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

  async deleteUser(user_id: string): Promise<UserDocument | undefined> {
    const execute = await this.userModel.findByIdAndDelete(user_id).populate('role');
    return execute || undefined;
  }

  getPermissions() {
    return modules;
  }

}
