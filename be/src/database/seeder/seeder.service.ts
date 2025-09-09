import { Injectable } from '@nestjs/common';
import { BrandSeederService } from './brand-seeder/brand-seeder.service';
import { UserSeederService } from './user-seeder/user-seeder.service';

@Injectable()
export class SeederService {
    constructor(
        private user: UserSeederService,
        private brand: BrandSeederService
    ) { }

    async seedAll() {
        await this.user.run();
        await this.brand.run();
    }
}
