import { Controller, Post, Body, Res, Next } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../user/user.schema';
import type { Response, NextFunction } from 'express';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

@Controller('auth')
export class AuthController {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  @Post('login')
  async login(
    @Body() body: { email: string; password: string },
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    try {
      const user = await this.userModel.findOne({ email: body.email }).select('+password');
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      const passwordIsValid = bcrypt.compareSync(body.password, user.password);
      if (!passwordIsValid) {
        return res.status(401).json({ success: false, message: 'Invalid password' });
      }

      const token = jwt.sign({ id: user.userId }, process.env.TOKEN as string);

      return res.status(202).json({ success: true, message: 'Success login', data: user, token });
    } catch (err) {
      console.error(err);
      next(err);
    }
  }
}
