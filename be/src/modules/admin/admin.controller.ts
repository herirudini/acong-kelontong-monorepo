import { Controller, Post, Body, Res, UseGuards, Put } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../user/user.schema';
import type { Response } from 'express';
import { AdminService } from './admin.service';
import { AuthGuard } from '../auth/auth.guard';
import { MailerService } from '@nestjs-modules/mailer';
import { encodeBase64 } from 'src/utils/helper';
import { InviteUserDto } from '../user/user.dto';

@Controller('admin')
export class AdminController {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
        private readonly adminService: AdminService,
        private readonly mailerService: MailerService
    ) { }

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
            res.status(200).json({ success: true, message: "Success to invite user", data: { invite, url: linkChangePassword } })
        }
        catch (err) {
            console.error(err);
            res.status(422).json({ success: false, message: "Failed to create user" });
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
            res.status(200).json({ success: true, message: "Success to resend verification", data: { invite, url: linkChangePassword } })
        }
        catch (err) {
            console.error(err);
            res.status(422).json({ success: false, message: "Failed to resend verification" });
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
                res.status(200).json({ success: true, message: "User verified successfully" });
            } else {
                res.status(422).json({ success: false, message: "Invalid or expired verification token" });
            }
        } catch (err) {
            console.error(err)
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    }
}