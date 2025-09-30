import { Injectable } from '@nestjs/common';
import { Role, RoleDocument } from './role.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GlobalService } from 'src/global/global.service';
import { IPaginationRes } from 'src/types/interfaces';
import { BaseResponse } from 'src/utils/base-response';

@Injectable()
export class RoleService {
  constructor(
    @InjectModel(Role.name) private roleModel: Model<RoleDocument>,
    private global: GlobalService
  ) { }

  async getListRole(
    page: number,
    size: number,
    sortBy?: string,
    sortDir: 'asc' | 'desc' = 'asc',
    search?: string,
    active?: boolean
  ): Promise<{ data: RoleDocument[]; meta: IPaginationRes }> {
    const searchFields: string[] = ['role_name'];
    let filter;
    if (active) {
      filter = { column: 'active', value: true }
    }

    return this.global.getList<Role, RoleDocument>(
      this.roleModel,
      {
        page,
        size,
        sortBy,
        sortDir,
        search,
        filter,
        searchFields,
      }
    )
  }

  async createRole(body: Role): Promise<RoleDocument> {
    const role_name = body.role_name;
    const modules = body.modules;

    const exist = await this.roleModel.findOne({ role_name });
    if (exist) {
      return BaseResponse.forbidden({ err: 'createRole exist' });
    }
    const newRole = await this.roleModel.create({
      role_name,
      modules
    });
    return newRole;
  }

  async getDetailRole(role_id: string): Promise<RoleDocument | undefined> {
    const role = await this.roleModel.findById(role_id);
    return role || undefined;
  }

  async editRole(role_id: string, data: RoleDocument): Promise<RoleDocument | undefined> {
    const {
      role_name,
      modules,
      active
    } = data;
    try {
      const uptatedRole = await this.roleModel.findByIdAndUpdate(
        role_id,
        {
          $set: {
            role_name,
            modules,
            active
          }
        },
        {
          new: true,         // return the updated doc
          runValidators: true, // validate before saving
        },
      ).exec();
      return uptatedRole || undefined;
    } catch (e) {
      return BaseResponse.unexpected({ err: { text: 'editRole', err: e.message } })
    }
  }

  async deleteRole(role_id: string): Promise<boolean> {
    const role = await this.roleModel.findById(role_id);
    if (!role) return BaseResponse.notFound({ option: { message: 'Role not found' } })
    if (role.active) return BaseResponse.forbidden({ option: { message: 'Cannot delete active role' } })
    await this.roleModel.findByIdAndDelete(role_id).exec();
    return true;
  }
}
