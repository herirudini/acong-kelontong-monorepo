import { Module } from '@nestjs/common';
import { UserSeederService } from './user/user-seeder.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/modules/user/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [UserSeederService],
  exports: [UserSeederService], // export so AppModule can trigger it
})
export class SeederModule {}
