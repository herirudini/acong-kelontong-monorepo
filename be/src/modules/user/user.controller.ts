import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post('create')
  create(
    @Body()
    body: {
      first_name: string;
      last_name: string;
      email: string;
      password: string;
      modules: string[];
      role: string;
    },
  ) {
    const data = {
      first_name: body.first_name,
      last_name: body.last_name,
      email: body.email,
      password: body.password,
      modules: body.modules,
      role: body.role,
    };
    return this.userService.create(data);
  }

  @Get('list')
  list() {
    return this.userService.findAll();
  }
}
