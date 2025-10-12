import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Brand, BrandDocument } from 'src/modules/brand/brand.schema';

@Injectable()
export class BrandSeederService {
    private readonly logger = new Logger(BrandSeederService.name);

    constructor(
        @InjectModel(Brand.name) private readonly brandModel: Model<BrandDocument>,
    ) { }

    async run() {
        const seedData = [
            {
                brand_name: 'Indomie',
                brand_description: 'Mie Instan',
            },
            {
                brand_name: 'Aqua',
                brand_description: 'Air minum',

            },
            {
                brand_name: 'Ultra Milk',
                brand_description: 'Susu',

            }
        ];

        for (const brand of seedData) {
            await this.brandModel.updateOne(
                { brand_name: brand.brand_name }, // lookup
                { $set: brand },                  // update data
                { upsert: true },                 // insert if not exists
            );
            console.info(`🚀 Seeded brand: ${brand.brand_name}`);
        }
    }
}
