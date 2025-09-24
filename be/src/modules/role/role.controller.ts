import { Body, Controller, Get, Param, Post, Put, Query, Res, UseGuards } from '@nestjs/common';
import { RoleService } from './role.service';
import { PaginationDto } from 'src/global/global.dto';
import { BaseResponse } from 'src/utils/base-response';
import type { Response } from 'express';
import type { RoleDocument } from './role.schema';
import { AuthGuard } from '../auth/auth.guard';

@Controller('roles')
export class RoleController {
  constructor(
    private readonly roleService: RoleService,
  ) { }

  @Get('')
  async list(
    @Query() { page, size, sortBy, sortDir, search }: PaginationDto,
    @Res() res: Response,
  ) {
    try {
      const { data, meta } = await this.roleService.getListRole(page, size, sortBy, sortDir, search);
      return BaseResponse.success({
        res,
        option: { message: 'Success get list role', list: data, meta },
      });
    } catch (err) {
      return BaseResponse.error({ res, err });
    }
  }

  @UseGuards(AuthGuard)
  @Post('create')
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

  @Get('detail/:role_id')
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

  @UseGuards(AuthGuard)
  @Put('detail/:role_id/edit-role')
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
}
