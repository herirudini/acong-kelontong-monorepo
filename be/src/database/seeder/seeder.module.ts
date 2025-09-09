import { Module } from '@nestjs/common';
import { UserSeederService } from './user-seeder/user-seeder.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/modules/user/user.schema';
import { BrandSeederService } from './brand-seeder/brand-seeder.service';
import { SeederService } from './seeder.service';
import { Brand, BrandSchema } from 'src/modules/brand/brand.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Brand.name, schema: BrandSchema }
    ]),
  ],
  providers: [SeederService, UserSeederService, BrandSeederService],
  exports: [MongooseModule, SeederService, UserSeederService, BrandSeederService], // export so AppModule can trigger it
})
export class SeederModule { }
