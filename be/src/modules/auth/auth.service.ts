// auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { InjectModel } from '@nestjs/mongoose';
import { Auth, AuthDocument } from './auth.schema';
import { Model } from 'mongoose';
import { UserDocument } from '../user/user.schema';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(Auth.name)
        private readonly authModel: Model<AuthDocument>,
    ) { }

    generateAccessToken(payload: { id: string, id0: string, modules: string[] }): string {
        return jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '15m' });
    }

    generateRefreshToken(payload: { id: string, id0: string }): string {
        return jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '7d' });
    }

    verifyToken(token: string): jwt.JwtPayload | string {
        try {
            return jwt.verify(token, process.env.JWT_SECRET as string);
        } catch (err) {
            console.error(err);
            throw new UnauthorizedException('Invalid token');
        }
    }

    async getAuthItem(token: string): Promise<AuthDocument | null> {
        try {
            const decoded: jwt.JwtPayload | string = this.verifyToken(token) as { id: string };
            const result = await this.authModel.findById(decoded.id);
            return result;
        } catch (err) {
            console.error(err);
            throw new UnauthorizedException('Invalid token');
        }
    }

    async login(user: UserDocument, userAgent: string): Promise<{ access_token: string; refresh_token: string }> {
        const createAuth = await this.authModel.create({
            user_id: user._id,
            modules: user.modules,
            user_agent: userAgent
        });
        const id = createAuth._id as string;
        const accessToken = this.generateAccessToken({ id, id0: user._id as string, modules: user.modules });
        const refreshToken = this.generateRefreshToken({ id, id0: user._id as string });
        await this.updateToken(id, accessToken);
        return { access_token: accessToken, refresh_token: refreshToken };
    }

    async updateToken(authId: string, accessToken: string): Promise<void> {
        const cryptedToken = await bcrypt.hash(accessToken, 10);
        await this.authModel.findByIdAndUpdate(authId, { token: cryptedToken }).exec();
    }

    async logout(token: string): Promise<void> {
        try {
            const decoded: jwt.JwtPayload | string = jwt.decode(token) as { id: string };
            await this.authModel.findByIdAndDelete(decoded.id).exec();
        } catch (err) {
            console.error(err);
            throw new UnauthorizedException('Invalid token');
        }
    }
}
