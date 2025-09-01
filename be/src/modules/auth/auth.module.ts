import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Auth, AuthSchema } from './auth.schema';

@Module({
  controllers: [AuthController],
  imports: [
    UserModule,
    MongooseModule.forFeature([
      { name: Auth.name, schema: AuthSchema },
    ]),
  ],
  providers: [AuthService, AuthGuard],
})
export class AuthModule { }
