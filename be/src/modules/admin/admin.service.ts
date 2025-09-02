import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { addDays, generateRandomToken } from 'src/utils/helper';
import { User, TmpUser } from '../user/user.schema';
import * as bcrypt from 'bcrypt';
import * as nodemailer from 'nodemailer';
import {
    SMTP_USER,
    SMTP_PASS,
    SMTP_HOST,
    SMTP_PORT,
    SALTS,
    SESSION_DAYS,
} from 'src/types/constants';
@Injectable()
export class AdminService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) { }

    mailer(options: { from: string, to: string, subject: string, text: string }) {
        const transporter = nodemailer.createTransport({ service: SMTP_HOST, port: parseInt(SMTP_PORT), auth: { user: SMTP_USER, pass: SMTP_PASS } });
        transporter.sendMail(options, {
        next: (res) => {
            console.info("Email sent: " + res)
        },
        error: (err) => {
            console.error(err)
            }

        });
    }

    async resendVerification(email: string): Promise<TmpUser> {
        const user = await this.userModel.findOne({ email });
        if (!user) {
            throw new Error("User not found");
        }
        // generate raw random password
        const tmpPassword = generateRandomToken()
        // hash temporary random password
        const password = await bcrypt.hash(tmpPassword, SALTS);
        user.password = password;
        user.verified = false;
        user.verifyDueTime = addDays(new Date(), SESSION_DAYS);
        await user.save();
        return {...user, tmpPassword} as unknown as TmpUser;
    }

    async inviteUser(body: User): Promise<TmpUser> {
        const role = body.role.toLowerCase();
        const first_name = body.first_name;
        const last_name = body.last_name;
        const email = body.email;
        const modules = body.modules;
        const exists = await this.userModel.findOne({email});
        if (exists) {
            throw new Error("User already exists");
        }
        // generate raw random password
        const tmpPassword = generateRandomToken()
        // hash temporary random password
        const password = await bcrypt.hash(tmpPassword, SALTS);

        const tmpUser = new this.userModel({
            first_name,
            last_name,
            email,
            role,
            password,
            modules,
            verified: false,
        });

        await tmpUser.save();
        return {...tmpUser, tmpPassword} as unknown as TmpUser;
    }

    async verifyUser(userId: string, tmpPassword: string, newPassword: string): Promise<boolean> {
        const tokenDoc = await this.userModel.findOne({
            userId,
            verified: false,
        });
        if (!tokenDoc) return false;
        const isValid = await bcrypt.compare(tmpPassword, tokenDoc.password);
        if (!isValid) return false;
        // mark as verified
        tokenDoc.password = await bcrypt.hash(newPassword, 10);
        tokenDoc.verified = true;
        await tokenDoc.save();
        return true;
    }
}
