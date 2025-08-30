import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(
    @Body()
    body: {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
      masterKey: string;
      isEmailConfirmed: boolean;
      modules: string[];
      role: string;
    },
  ) {
    return this.userService.create(
      body.firstName,
      body.lastName,
      body.email,
      body.password,
      body.masterKey,
      body.isEmailConfirmed,
      body.modules,
      body.role,
    );
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }
}
