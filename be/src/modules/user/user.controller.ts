import { Body, Controller, Get, Param, Put, Req, Res, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '../auth/auth.guard';
import { BaseResponse } from 'src/utils/base-response';
import type { Response } from 'express';

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
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const list = await this.userService.findAll();
    return BaseResponse.success({ res, option: { message: 'Success get list user', list } })
  }

}
