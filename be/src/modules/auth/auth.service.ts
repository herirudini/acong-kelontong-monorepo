// auth.service.ts
import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { InjectModel } from '@nestjs/mongoose';
import { Auth, AuthDocument } from './auth.schema';
import { Model } from 'mongoose';
import { UserDocument } from '../user/user.schema';
import { encrypt, decrypt } from 'src/utils/helper';
import { ITokenPayload, IRefreshTokenPayload, TLogoutOption } from 'src/types/interfaces';
import { sessionDays, sessionMinutes } from 'src/types/constants';
import { logoutOption } from 'src/types/enums';
import { BaseResponse } from 'src/utils/base-response';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(Auth.name)
        private readonly authModel: Model<AuthDocument>,
    ) { }

    generateAccessToken(payload: ITokenPayload): string {
        return jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: sessionMinutes + 'm' });
    }

    generateRefreshToken(payload: IRefreshTokenPayload): string {
        return jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: sessionDays + 'd' });
    }

    verifyToken(token: string): jwt.JwtPayload | string {
        try {
            return jwt.verify(token, process.env.JWT_SECRET as string);
        } catch (err) {
            return BaseResponse.unauthorized({ err: { text: 'auth verifyToken catch', err } });
        }
    }

    async getAuthItem(token: string): Promise<AuthDocument | null> {
        try {
            const decoded: jwt.JwtPayload | string = jwt.decode(token) as { id: string };
            const result = await this.authModel.findById(decoded.id);
            return result;
        } catch (err) {
            return BaseResponse.unauthorized({ err });
        }
    }

    async login(user: UserDocument, userAgent: string): Promise<{ access_token: string; refresh_token: string }> {
        const createAuth = await this.authModel.create({
            user_id: user._id,
            modules: user.modules,
            user_agent: userAgent,
        });
        const id = createAuth._id as string;
        const accessToken = this.generateAccessToken({ id, id0: user._id as string, modules: user.modules });
        const refreshToken = this.generateRefreshToken({ id, id0: user._id as string });
        await this.updateToken(id, accessToken);
        return { access_token: accessToken, refresh_token: refreshToken };
    }

    async compareDBToken(accessToken: string): Promise<AuthDocument | null> {
        const auth: AuthDocument | null = await this.getAuthItem(accessToken);
        if (!auth) {
            await this.logout(accessToken);
            return BaseResponse.unauthorized({ err: 'compareDBToken !auth' });
        }
        const decrypted = decrypt(auth.token) as string;
        if (accessToken === decrypted) return auth;
        return null;
    }

    async updateToken(authId: string, accessToken: string): Promise<AuthDocument> {
        const encrypted = encrypt(accessToken);
        const updated = await this.authModel.findByIdAndUpdate(authId, { token: encrypted }).exec();
        if (!updated) return BaseResponse.unexpected({ err: 'login !updated' })
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
            return BaseResponse.unauthorized({ err: { text: 'logout catch', err } });
        }
    }
}
