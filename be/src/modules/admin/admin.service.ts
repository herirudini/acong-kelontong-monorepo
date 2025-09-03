import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { addDays, decodeBase64, generateRandomToken } from 'src/utils/helper';
import { User, TmpUser } from '../user/user.schema';
import * as bcrypt from 'bcrypt';
import { salts, sessionDays } from 'src/types/constants';
@Injectable()
export class AdminService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) { }

    async resendVerification(email: string): Promise<{ tmpUser: TmpUser, tmpPassword: string }> {
        const tmpUser = await this.userModel.findOne({ email });
        if (!tmpUser) {
            throw new Error("User not found");
        }
        // generate raw random password
        const tmpPassword = generateRandomToken()
        // hash temporary random password
        const password = await bcrypt.hash(tmpPassword, salts);
        tmpUser.password = password;
        tmpUser.verified = false;
        tmpUser.verifyDueTime = addDays(new Date(), sessionDays);
        await tmpUser.save();
        return { tmpUser, tmpPassword } as unknown as { tmpUser: TmpUser, tmpPassword: string };
    }

    async inviteUser(body: User): Promise<{ tmpUser: TmpUser, tmpPassword: string }> {
        const role = body.role.toLowerCase();
        const first_name = body.first_name;
        const last_name = body.last_name;
        const email = body.email;
        const modules = body.modules;
        const exists = await this.userModel.findOne({ email });
        if (exists) {
            throw new Error("User already exists");
        }
        // generate raw random password
        const tmpPassword = generateRandomToken()
        // hash temporary random password
        const password = await bcrypt.hash(tmpPassword, salts);
        const tmpUser = await this.userModel.create({
            first_name,
            last_name,
            email,
            role,
            password,
            modules,
            verified: false,
        });

        return { tmpUser, tmpPassword } as unknown as { tmpUser: TmpUser, tmpPassword: string };
    }

    async verifyUser(tmpPassword: string, newPassword: string): Promise<boolean> {
        const base64 = decodeBase64(tmpPassword);
        const ticket = JSON.parse(base64);
        const tokenDoc = await this.userModel.findById(ticket.pass1);
        if (!tokenDoc) return false;
        const isValid = await bcrypt.compare(ticket.pass2, tokenDoc.password);
        if (!isValid) return false;
        // mark as verified
        tokenDoc.password = await bcrypt.hash(newPassword, salts);
        tokenDoc.verified = true;
        await tokenDoc.save();
        return true;
    }
}
