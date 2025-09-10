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
                brand_code: 'INDOMIE_KLD_PCS',
                brand_name: 'Indomie Kaldu Ayam',
                unit_of_measure: unitOfMeasure.PCS,
                barcode: 'INDOMIE_KLD_PCS',
                description: 'Indonesian Noodle',
                is_active: true,
            },
            {
                brand_code: 'GULAKU_100GR',
                brand_name: 'Gulaku 100gr',
                unit_of_measure: unitOfMeasure.PCS,
                barcode: 'GULAKU_100GR',
                description: 'Sugar money',
                is_active: true,
            },
            {
                brand_code: 'SUPERMILD_12',
                brand_name: 'Supermild 12',
                unit_of_measure: unitOfMeasure.PCS,
                barcode: 'SUPERMILD_12',
                description: 'Cigarette mild',
                is_active: true,
            },
            {
                brand_code: "MINYAKITA_100ML",
                brand_name: "Minyakita 100ml",
                unit_of_measure: unitOfMeasure.PCS,
                barcode: "MINYAKITA_100ML",
                description: "Oily liquid",
                is_active: true
            }
        ];

        for (const brand of seedData) {
            await this.brandModel.updateOne(
                { brand_code: brand.brand_code }, // lookup
                { $set: brand },                  // update data
                { upsert: true },                 // insert if not exists
            );
            console.info(`🚀 Seeded brand: ${brand.brand_code}`);
        }
    }
}
