import { Controller, Post, Body, Res, UseGuards, Put } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, TmpUser, UserDocument } from '../user/user.schema';
import type { Response } from 'express';
import { AdminService } from './admin.service';
import { InviteUserDto } from 'src/dto/invite-user.dto';
import { SMTP_USER, URL_CHANGE_PASSWORD } from 'src/types/constants';
import { AuthGuard } from '../auth/auth.guard';

@Controller('admin')
export class AdminController {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
        private readonly adminService: AdminService,
    ) { }

    @UseGuards(AuthGuard)
    @Post('invite-user')
    async inviteUser(
        @Body() body: InviteUserDto,
        @Res() res: Response,
    ) {
        let tmpUser: TmpUser;
        let linkChangePassword: string;

        try {
            tmpUser = await this.adminService.inviteUser(body as User)
            linkChangePassword = URL_CHANGE_PASSWORD + `/${tmpUser._id as string}/${tmpUser.tmpPassword}`;
            const mailOptions = {
                from: `"Acong Kelontong" <${SMTP_USER}>`,
                to: tmpUser.email,
                subject: "Verify Account",
                text: `Hello ${tmpUser.first_name}! \nPlease click the link below to verify your account: \n${linkChangePassword}`
            };
            this.adminService.mailer(mailOptions);
            res.status(200).json({ success: true, message: "Success to invite user", data: tmpUser })
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
        let tmpUser: TmpUser;
        let linkChangePassword: string;

        try {
            tmpUser = await this.adminService.resendVerification(body.email)
            linkChangePassword = URL_CHANGE_PASSWORD + `/${tmpUser._id as string}/${tmpUser.tmpPassword}`;
            const mailOptions = {
                from: `"Acong Kelontong" <${SMTP_USER}>`,
                to: tmpUser.email,
                subject: "Verify Account",
                text: `Hello ${tmpUser.first_name}! \nPlease click the link below to verify your account: \n${linkChangePassword}`
            };
            this.adminService.mailer(mailOptions);
            res.status(200).json({ success: true, message: "Success to resend verification", data: tmpUser })
        }
        catch (err) {
            console.error(err);
            res.status(422).json({ success: false, message: "Failed to resend verification" });
        }
    }

    @Put('verify-user')
    async verifyUser(
        @Body() body: { userId: string, tmpPassword: string, newPassword: string },
        @Res() res: Response,
    ) {
        const { userId, tmpPassword, newPassword } = body;
        try {
            const isVerified = await this.adminService.verifyUser(userId, tmpPassword, newPassword);
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