import { Controller, Post, Body, Res, UseGuards, Put, Get } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../user/user.schema';
import type { Response } from 'express';
import { AdminService } from './admin.service';
import { AuthGuard } from '../auth/auth.guard';
import { MailerService } from '@nestjs-modules/mailer';
import { encodeBase64 } from 'src/utils/helper';
import { InviteUserDto } from '../user/user.dto';
import { BaseResponse } from 'src/utils/base-response';

@Controller('admin')
export class AdminController {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
        private readonly adminService: AdminService,
        private readonly mailerService: MailerService
    ) { }

    @UseGuards(AuthGuard)
    @Get('permissions')
    list(
        @Res() res: Response,
    ) {
        const data = this.adminService.getPermissions();
        return BaseResponse.success({
            res,
            option: { message: 'Success get list user', detail: { permissions: data } },
        });
    }

    @UseGuards(AuthGuard)
    @Post('invite-user')
    async inviteUser(
        @Body() body: InviteUserDto,
        @Res() res: Response,
    ) {
        try {
            const invite = await this.adminService.inviteUser(body as User)
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
            const invite = await this.adminService.resendVerification(body.email)
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
            const isVerified = await this.adminService.verifyUser(tmpPassword, newPassword);
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