import { Body, Controller, Get, Param, Put, Query, Res, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '../auth/auth.guard';
import { BaseResponse } from 'src/utils/base-response';
import type { Response } from 'express';
import { PaginationDto } from 'src/dto/pagination.dto';

UseGuards(AuthGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Put(':user_id/edit-profile')
  async editProfile(
    @Param('user_id') user_id: string,
    @Body()
    body: {
      first_name: string;
      last_name: string;
      email: string;
      password: string;
    },
    @Res() res: Response,
  ) {
    const detail = await this.userService.editUser(user_id, body);
    return BaseResponse.success({ res, option: { message: 'Success edit user', detail } })
  }

  @Put(':user_id/edit-permission')
  async editPermission(
    @Param('user_id') user_id: string,
    @Body() body: {
      modules: string[];
      role: string;
    },
    @Res() res: Response,
  ) {
    const detail = await this.userService.editUser(user_id, body);
    return BaseResponse.success({ res, option: { message: 'Success edit user', detail } })
  }

  @Get('')
  async list(
    @Query() { page, size, sortBy, sortDir, search, verified }: PaginationDto,
    @Res() res: Response,
  ) {
    const { data, meta } = await this.userService.getListUser(page, size, sortBy, sortDir, search, Boolean(verified));
    return BaseResponse.success({
      res,
      option: { message: 'Success get list user', list: data, meta },
    });
  }


}
