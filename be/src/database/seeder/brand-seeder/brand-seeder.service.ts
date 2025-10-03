import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Brand, BrandDocument } from 'src/modules/brand/brand.schema';
import { unitOfMeasure } from 'src/types/enums';

@Injectable()
export class BrandSeederService {
    private readonly logger = new Logger(BrandSeederService.name);

    constructor(
        @InjectModel(Brand.name) private readonly brandModel: Model<BrandDocument>,
    ) { }

    async run() {
        const seedData = [
            {
                brand_name: 'Indomie Kaldu Ayam',
                description: 'Indonesian Noodle',
            },
            {
                brand_name: 'Gulaku 100gr',
                description: 'Sugar money',

            },
            {
                brand_name: 'Supermild 12',
                description: 'Cigarette mild',

            },
            {
                brand_name: "Minyakita 100ml",
                description: "Oily liquid",
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
