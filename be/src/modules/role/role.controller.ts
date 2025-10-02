import { Body, Controller, Delete, Get, Param, Post, Put, Query, Res, UseGuards } from '@nestjs/common';
import { RoleService } from './role.service';
import { BaseResponse } from 'src/utils/base-response';
import type { Response } from 'express';
import type { RoleDocument } from './role.schema';
import { AuthGuard } from '../auth/auth.guard';
import { GetRolesDTO } from './role.dto';
import { Permission } from 'src/global/permission.decoratior';

@UseGuards(AuthGuard)
@Controller('roles')
export class RoleController {
  constructor(
    private readonly roleService: RoleService,
  ) { }

  @Permission(['users.create', 'users.edit', 'roles.view'])
  @Get('')
  async list(
    @Query() { page, size, sortBy, sortDir, search, active }: GetRolesDTO,
    @Res() res: Response,
  ) {
    try {
      const { data, meta } = await this.roleService.getListRole(page, size, sortBy, sortDir, search, active);
      return BaseResponse.success({
        res,
        option: { message: 'Success get list role', list: data, meta },
      });
    } catch (err) {
      return BaseResponse.error({ res, err });
    }
  }

  @Permission(['roles.create'])
  @Post('')
  async createRole(
    @Body() body: RoleDocument,
    @Res() res: Response,
  ) {
    try {
      const newRole = await this.roleService.createRole(body)
      return BaseResponse.success({ res, option: { message: "Success create role", detail: newRole } });
    }
    catch (err) {
      return BaseResponse.error({ res, err });
    }
  }

  @Permission(['roles.view'])
  @Get(':role_id')
  async detail(
    @Param('role_id') role_id: string,
    @Res() res: Response,
  ) {
    try {
      const detail = await this.roleService.getDetailRole(role_id);
      return BaseResponse.success({
        res,
        option: { message: 'Success get detail role', detail },
      });
    } catch (err) {
      return BaseResponse.error({ res, err });
    }
  }

  @Permission(['roles.edit'])
  @Put(':role_id')
  async edit(
    @Param('role_id') role_id: string,
    @Body() body: RoleDocument,
    @Res() res: Response,
  ) {
    try {
      const detail = await this.roleService.editRole(role_id, body);
      return BaseResponse.success({ res, option: { message: 'Success edit role', detail } })
    } catch (err) {
      return BaseResponse.error({ res, err });
    }
  }

  @Permission(['roles.delete'])
  @Delete(':role_id')
  async delete(
    @Param('role_id') role_id: string,
    @Res() res: Response,
  ) {
    try {
      await this.roleService.deleteRole(role_id);
      return BaseResponse.success({ res, option: { message: 'Success delete role' } })
    } catch (err) {
      return BaseResponse.error({ res, err });
    }
  }

  @UseGuards(AuthGuard)
  @Get('permissions')
  listPermission(
    @Res() res: Response,
  ) {
    try {
      const data = this.roleService.getPermissions();
      return BaseResponse.success({
        res,
        option: { message: 'Success get list permission', detail: data },
      });
    } catch (err) {
      return BaseResponse.error({ res, err });
    }
  }
}
