import { Controller, Post, Body, Res, Req, Query } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../user/user.schema';
import type { Request, Response } from 'express';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { sessionDays } from 'src/types/constants';
import { BaseResponse } from 'src/utils/base-response';
import { LoginDto, LogoutDto } from './auth.dto';

@Controller('auth')
export class AuthController {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
        private readonly authService: AuthService,
    ) { }

    @Post('login')
    async login(
        @Req() req: Request,
        @Body() body: LoginDto,
        @Res() res: Response,
    ) {
        try {
            const user = await this.userModel.findOne({ email: body.email }).select('+password').populate('role');
            if (!user) {
                return BaseResponse.unauthorized({ res, option: { message: 'Invalid email or password' } });
            }
            if (!user.verified) {
                return BaseResponse.unauthorized({ res, option: { message: 'Invalid email or password' } });
            }
            const passwordIsValid = await bcrypt.compare(body.password, user.password);
            if (!passwordIsValid) {
                return BaseResponse.unauthorized({ res, option: { message: 'Invalid email or password' } });
            }

            const userAgent: string = req.headers['user-agent'] as string;
            const { access_token, refresh_token } = await this.authService.login(user, userAgent);
            // set refresh_token in HttpOnly cookie
            res.cookie('refresh_token', refresh_token, {
                httpOnly: true,
                secure: Boolean(process.env.IS_PROD), // set true if HTTPS
                sameSite: 'strict',
                path: '/', // only sent to refresh endpoint
                maxAge: sessionDays * 24 * 60 * 60 * 1000,
            });
            const resData = {
                access_token, profile: {
                    first_name: user.first_name,
                    last_name: user.last_name,
                    role: user.role,
                }
            }
            return BaseResponse.success({ res, option: { detail: resData } });
        } catch (err) {
            return BaseResponse.unexpected({ res, err });
        }
    }

    @Post('refresh')
    async refresh(@Req() req: Request, @Res() res: Response) {
        try {
            const authHeader: string = req.headers['authorization'] as string;
            const refreshToken = req.cookies['refresh_token'] as string;
            const accessToken = authHeader.split(' ')[1]; // remove "Bearer"

            // check if user still on login session time and compare header and db token
            const verifyRefreshToken = this.authService.verifyToken(refreshToken)
            const auth = await this.authService.compareDBToken(accessToken);
            if (auth && verifyRefreshToken) {
                const authId = auth._id as string;
                const newAccessToken = this.authService.generateAccessToken({ id: authId, id0: auth.user_id, role: auth.role });
                await this.authService.updateToken(authId, newAccessToken);
                return BaseResponse.success({ res, option: { detail: { access_token: newAccessToken } } });
            } else {
                await this.authService.logout(refreshToken);
                return BaseResponse.unauthorized({ res });
            }
        } catch (err) {
            return BaseResponse.unexpected({ res, err });
        }
    }

    @Post('logout')
    async logout(
        @Req() req: Request,
        @Query() query: LogoutDto,
        @Res() res: Response,
    ) {
        try {
            const authHeader: string = req.headers['authorization'] as string;
            if (!authHeader) {
                return BaseResponse.unauthorized({ res, err: 'Post(logout) Missing token' });
            }
            const accessToken = authHeader.split(' ')[1]; // remove "Bearer"
            const compared = await this.authService.compareDBToken(accessToken);
            if (!compared) return BaseResponse.unauthorized({ res, err: 'Post(logout) !compared' });
            await this.authService.logout(accessToken, query.option);
            res.clearCookie('refresh_token', { path: '/' });
            return BaseResponse.success({ res, option: { message: 'Logout success!' } });
        } catch (err) {
            return BaseResponse.unexpected({ res, err });
        }
    }
}
