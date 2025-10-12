import { Module } from '@nestjs/common';
import { UserSeederService } from './user-seeder/user-seeder.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/modules/user/user.schema';
import { BrandSeederService } from './brand-seeder/brand-seeder.service';
import { SeederService } from './seeder.service';
import { Brand, BrandSchema } from 'src/modules/brand/brand.schema';
import { Role, RoleSchema } from 'src/modules/role/role.schema';
import { SupplierSeederService } from './supplier-seeder/supplier-seeder.service';
import { Supplier, SupplierSchema } from 'src/modules/supplier/supplier.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Role.name, schema: RoleSchema },
      { name: Brand.name, schema: BrandSchema },
      { name: Supplier.name, schema: SupplierSchema },
    ]),
  ],
  providers: [SeederService, UserSeederService, BrandSeederService, SupplierSeederService],
  exports: [MongooseModule, SeederService, UserSeederService, BrandSeederService], // export so AppModule can trigger it
})
export class SeederModule { }
