import { Controller, Post, Body, Res, Req, Query, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../user/user.schema';
import type { Request, Response } from 'express';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { AuthDocument } from './auth.schema';
import { SessionQueryDto } from 'src/dto/session-query.dto';
import { LoginDto } from 'src/dto/login.dto';
import { AuthGuard } from './auth.guard';
import { sessionDays } from 'src/types/constants';

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
            const user = await this.userModel.findOne({ email: body.email }).select('+password');
            if (!user) {
                return res.status(401).json({ success: false, message: 'Invalid email or password' });
            }
            if (!user.verified) {
                return res.status(401).json({ success: false, message: 'Invalid email or password' });
            }
            const passwordIsValid = await bcrypt.compare(body.password, user.password);
            if (!passwordIsValid) {
                return res.status(401).json({ success: false, message: 'Invalid email or password' });
            }

            const userAgent: string = req.headers['user-agent'] as string;
            const { access_token, refresh_token } = await this.authService.login(user, userAgent);
            // set refresh_token in HttpOnly cookie
            res.cookie('refresh_token', refresh_token, {
                httpOnly: true,
                secure: true, // set true if HTTPS
                sameSite: 'strict',
                path: '/auth/refresh', // only sent to refresh endpoint
                maxAge: sessionDays * 24 * 60 * 60 * 1000,
            });
            return res.status(200).json({
                success: true, message: 'Success login', access_token, profile: {
                    first_name: user.first_name,
                    last_name: user.last_name,
                    role: user.role,
                    modules: user.modules,
                }
            });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Login failed' });
        }
    }

    @Post('refresh')
    async refresh(@Req() req: Request, @Res() res: Response) {
        try {
            const authHeader: string = req.headers['authorization'] as string;
            const refreshToken = req.cookies['refresh_token'] as string;
            if (!authHeader || !refreshToken) {
                console.error('Post(refresh) Missing token');
                return res.status(500).json({ success: false, message: 'Middle finger error' });
            }

            const headerToken = authHeader.split(' ')[1]; // remove "Bearer"
            const userAgent: string = req.headers['user-agent'] as string;

            // check if user still on login session time and return the id then validate
            const auth: AuthDocument | null = await this.authService.getAuthItem(refreshToken);
            if (!auth || !headerToken) {
                console.error('Post(refresh) Missing auth', headerToken, auth);
                await this.authService.logout(refreshToken);
                return res.status(401).json({ success: false, message: 'Unauthorized' });
            }
            const tokenIsValid = await this.authService.compareDBToken(headerToken, auth.token);
            const authId = auth._id as string;
            if (userAgent === auth.user_agent && tokenIsValid) {
                const newAccessToken = this.authService.generateAccessToken({ id: authId, id0: auth.user_id, modules: auth.modules });
                await this.authService.updateToken(authId, newAccessToken);
                return res.status(200).json({ access_token: newAccessToken });
            } else {
                await this.authService.logout(refreshToken);
                return res.status(401).json({ message: 'Unauthorized' });
            }
        } catch (err) {
            console.error(err);
            await this.logout(req, {}, res);
            return res.status(401).json({ message: 'Unauthorized' });
        }
    }

    @UseGuards(AuthGuard)
    @Post('logout')
    async logout(
        @Req() req: Request,
        @Query() query: SessionQueryDto,
        @Res() res: Response,
    ) {
        try {
            const authHeader: string = req.headers['authorization'] as string;
            if (!authHeader) {
                console.error('Post(logout) Missing token');
                return res.status(401).json({ success: false, message: 'Unauthorized' });
            }
            const token = authHeader.split(' ')[1]; // remove "Bearer"
            await this.authService.logout(token, query.session);
            res.clearCookie('refresh_token', { path: '/auth/refresh' });
            return res.status(200).json({ success: true, message: 'Logout success' });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
}
