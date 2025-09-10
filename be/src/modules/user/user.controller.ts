import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '../auth/auth.guard';

UseGuards(AuthGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Put(':user_id/edit-profile')
  editProfile(
    @Param('user_id') user_id: string,
    @Body()
    body: {
      first_name: string;
      last_name: string;
      email: string;
      password: string;
    },
  ) {
    return this.userService.editUser(user_id, body);
  }

  @Put(':user_id/edit-permission')
  editPermission(
    @Param('user_id') user_id: string,
    @Body()
    body: {
      modules: string[];
      role: string;
    },
  ) {
    return this.userService.editUser(user_id, body);
  }

  @Get('list')
  list() {
    return this.userService.findAll();
  }
}
