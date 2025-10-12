import { Injectable } from '@nestjs/common';
import { BrandSeederService } from './brand-seeder/brand-seeder.service';
import { UserSeederService } from './user-seeder/user-seeder.service';
import { SupplierSeederService } from './supplier-seeder/supplier-seeder.service';

@Injectable()
export class SeederService {
    constructor(
        private user: UserSeederService,
        private brand: BrandSeederService,
        private supplier: SupplierSeederService
    ) { }

    async seedAll() {
        await this.user.run();
        await this.brand.run();
        await this.supplier.run();
    }
}
