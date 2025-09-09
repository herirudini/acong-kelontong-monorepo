import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Auth, AuthSchema } from './auth.schema';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  controllers: [AuthController],
  imports: [
    MongooseModule.forFeature([
      { name: Auth.name, schema: AuthSchema },
    ]),
    SharedModule
  ],
  providers: [AuthService],
  exports: [MongooseModule, AuthService],
})
export class AuthModule { }
