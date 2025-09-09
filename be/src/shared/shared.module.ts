import { Module } from '@nestjs/common';
import { SharedService } from './shared.service';
import { SharedController } from './shared.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/shared/shared-user/user.schema';
import { AuthGuard } from './shared-auth/auth.guard';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [SharedController],
  providers: [SharedService, AuthGuard],
  exports: [MongooseModule, AuthGuard, SharedService]
})
export class SharedModule { }
