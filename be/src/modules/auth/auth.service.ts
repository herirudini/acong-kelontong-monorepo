import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { InjectModel } from '@nestjs/mongoose';
import { Auth, AuthDocument } from './auth.schema';
import { Document, Model, Types } from 'mongoose';
import { UserDocument } from '../user/user.schema';
import { encrypt, decrypt } from 'src/utils/helper';
import { ITokenPayload, IRefreshTokenPayload, TLogoutOption } from 'src/types/interfaces';
import { sessionDays, sessionMinutes } from 'src/types/constants';
import { logoutOption } from 'src/types/enums';
import { BaseResponse } from 'src/utils/base-response';
import { RoleDocument } from '../role/role.schema';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(Auth.name)
        private readonly authModel: Model<Auth>,
    ) { }

    generateAccessToken(payload: ITokenPayload): string {
        return jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: sessionMinutes + 'm' });
    }

    generateRefreshToken(payload: IRefreshTokenPayload): string {
        return jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: sessionDays + 'd' });
    }

    verifyToken(token: string): jwt.JwtPayload | string {
        return jwt.verify(token, process.env.JWT_SECRET as string);
    }

    async getAuthItem(token: string): Promise<Auth | null> {
        try {
            const decoded: jwt.JwtPayload | string = jwt.decode(token) as { id: string };
            const result = await this.authModel.findById(decoded.id).populate('role');
            return result;
        } catch (err) {
            throw BaseResponse.invalid({ err });
        }
    }

    async login(user: UserDocument & {role: RoleDocument}, userAgent: string): Promise<{ access_token: string; refresh_token: string }> {
        const createAuth = await this.authModel.create({
            user_id: user._id,
            role: user.role,
            user_agent: userAgent,
        });
        const id = createAuth._id;
        const accessToken = this.generateAccessToken({ id, id0: user._id as Types.ObjectId, role: user.role });
        const refreshToken = this.generateRefreshToken({ id, id0: user._id as Types.ObjectId });
        await this.updateToken(id, accessToken);
        return { access_token: accessToken, refresh_token: refreshToken };
    }

    async compareDBToken(accessToken: string): Promise<Auth | null> {
        const auth: Auth | null = await this.getAuthItem(accessToken);
        if (!auth) {
            await this.logout(accessToken);
            throw BaseResponse.invalid({ err: 'compareDBToken !auth' });
        }
        const decrypted = decrypt(auth.token) as string;
        if (accessToken === decrypted) return auth;
        return null;
    }

    async updateToken(authId: Types.ObjectId, accessToken: string): Promise<Auth> {
        const encrypted = encrypt(accessToken);
        const updated = await this.authModel.findByIdAndUpdate(authId, { token: encrypted }).populate('role').exec();
        if (!updated) throw BaseResponse.unexpected({ err: 'login !updated' })
        return updated
    }

    async logout(token: string, option?: TLogoutOption): Promise<any> {
        try {
            const decoded: jwt.JwtPayload | string = jwt.decode(token) as { id: string };
            if (option === logoutOption.all) {
                return await this.authModel.deleteMany({ user_id: decoded.id0 }).exec();
            } else if (option === logoutOption.other) {
                return await this.authModel.deleteMany({ user_id: decoded.id0, _id: { $ne: decoded.id } }).exec();
            }
            return await this.authModel.findByIdAndDelete(decoded.id).exec();
        } catch (err) {
            throw BaseResponse.forbidden({ err: { text: 'logout catch', err } });
        }
    }
}
