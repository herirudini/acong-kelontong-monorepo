import { Body, Controller, Get, Param, Post, Put, Query, Res, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '../auth/auth.guard';
import { BaseResponse } from 'src/utils/base-response';
import type { Response } from 'express';
import { GetUserListDto, InviteUserDto } from './user.dto';
import { encodeBase64 } from 'src/utils/helper';
import { MailerService } from '@nestjs-modules/mailer';

UseGuards(AuthGuard)
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly mailerService: MailerService
  ) { }

  @Get('')
  async list(
    @Query() { page, size, sortBy, sortDir, search, verified }: GetUserListDto,
    @Res() res: Response,
  ) {
    const { data, meta } = await this.userService.getListUser(page, size, sortBy, sortDir, search, verified);
    return BaseResponse.success({
      res,
      option: { message: 'Success get list user', list: data, meta },
    });
  }

  @Get('detail/:user_id')
  async detail(
    @Param('user_id') user_id: string,
    @Res() res: Response,
  ) {
    const detail = await this.userService.getDetailUser(user_id);
    return BaseResponse.success({
      res,
      option: { message: 'Success get detail user', detail },
    });
  }

  @Put('detail/:user_id/edit-profile')
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

  @Put('detail/:user_id/edit-permission')
  async editPermission(
    @Param('user_id') user_id: string,
    @Body() body: {
      role: string;
    },
    @Res() res: Response,
  ) {
    const detail = await this.userService.editUser(user_id, body);
    return BaseResponse.success({ res, option: { message: 'Success edit user', detail } })
  }

  @UseGuards(AuthGuard)
  @Get('permission-list')
  listPermission(
    @Res() res: Response,
  ) {
    const data = this.userService.getPermissions();
    return BaseResponse.success({
      res,
      option: { message: 'Success get list user', detail: data },
    });
  }

  @UseGuards(AuthGuard)
  @Post('invite-user')
  async inviteUser(
    @Body() body: InviteUserDto,
    @Res() res: Response,
  ) {
    try {
      const invite = await this.userService.inviteUser(body)
      const ticket = { pass1: invite.tmpUser._id, pass2: invite.tmpPassword }
      const base64 = encodeBase64(JSON.stringify(ticket))
      const linkChangePassword = `${process.env.URL_CHANGE_PASSWORD as string}/${base64}`;
      const mailOptions = {
        from: `"Acong Kelontong" <${process.env.SMTP_USER as string}>`,
        to: invite.tmpUser.email,
        subject: "Verify Account",
        html: `Hello <b>${invite.tmpUser.first_name}</b>! \nPlease click the link below to verify your account: \n${linkChangePassword}`,
      };
      this.mailerService
        .sendMail({
          ...mailOptions,
        })
        .then((res) => {
          console.info("Email sent: " + res)
        })
        .catch((err) => {
          console.error(err)
        });
      return BaseResponse.success({ res, option: { message: "Success to invite user", detail: { url: linkChangePassword } } });
    }
    catch (err) {
      return BaseResponse.unexpected({ res, err });
    }
  }

  @UseGuards(AuthGuard)
  @Post('resend-verification')
  async resendVerification(
    @Body() body: { email: string },
    @Res() res: Response,
  ) {
    try {
      const invite = await this.userService.resendVerification(body.email)
      const ticket = { pass1: invite.tmpUser._id, pass2: invite.tmpPassword }
      const base64 = encodeBase64(JSON.stringify(ticket))
      const linkChangePassword = `${process.env.URL_CHANGE_PASSWORD as string}/${base64}`;
      const mailOptions = {
        from: `"Acong Kelontong <No Reply>" <${process.env.SMTP_USER as string}>`,
        to: invite.tmpUser.email,
        subject: "Verify Account",
        html: `Hello <b>${invite.tmpUser.first_name}</b>! \nPlease click the link below to verify your account: \n${linkChangePassword}`,
      };
      this.mailerService
        .sendMail({
          ...mailOptions,
        })
        .then((res) => {
          console.info("Email sent: " + res)
        })
        .catch((err) => {
          console.error(err)
        });
      return BaseResponse.success({ res, option: { message: "Success to resend verification", detail: { url: linkChangePassword } } });
    }
    catch (err) {
      return BaseResponse.unexpected({ res, err });
    }
  }

  @Put('verify-user')
  async verifyUser(
    @Body() body: { tmpPassword: string, newPassword: string },
    @Res() res: Response,
  ) {
    const { tmpPassword, newPassword } = body;
    try {
      const isVerified = await this.userService.verifyUser(tmpPassword, newPassword);
      if (isVerified) {
        return BaseResponse.success({ res, option: { message: "User verified successfully" } });
      } else {
        return BaseResponse.unauthorized({ res, option: { message: "Invalid or expired verification token" } });
      }
    } catch (err) {
      return BaseResponse.unexpected({ res, err });
    }
  }

}
