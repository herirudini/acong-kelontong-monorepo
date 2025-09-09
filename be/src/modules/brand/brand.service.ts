import { Injectable } from '@nestjs/common';
import { Brand, BrandDocument } from './brand.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class BrandService {
    constructor(
        @InjectModel(Brand.name) private readonly brandModel: Model<BrandDocument>,
    ) { }

    async createBrand(data: Brand): Promise<BrandDocument> {
        try {
            const newBrand = await this.brandModel.create(data);
            return newBrand;
        } catch {
            throw new Error('Failed to create')
        }
    }

    async editBrand(id: string, data: Brand): Promise<BrandDocument | null> {
        try {
            const updatedBrand = await this.brandModel.findByIdAndUpdate(id, data);
            return updatedBrand;
        } catch {
            throw new Error('Failed to edit')
        }
    }
}
