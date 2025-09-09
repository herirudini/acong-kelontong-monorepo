import { Injectable } from '@nestjs/common';
import { Brand, BrandDocument } from './brand.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class BrandService {
    constructor(
        @InjectModel(Brand.name) private readonly brandModel: Model<BrandDocument>,
    ) { }

    async listBrand(query: string): Promise<BrandDocument[]> {
        try {
            const listBrand = await this.brandModel.find({
                $or: [
                    { brand_name: { $regex: query, $options: 'i' } },  // case-insensitive
                    { brand_code: { $regex: query, $options: 'i' } },
                    { barcode: { $regex: query, $options: 'i' } },
                ],
            }).exec();
            return listBrand
        } catch {
            throw new Error('Failed to get list')
        }
    }

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
            console.log('data', data);
            const updatedBrand = await this.brandModel.findByIdAndUpdate(
                id,
                { $set: data },
                {
                    new: true,         // return the updated doc
                    runValidators: true, // validate before saving
                },
            ).exec();
            return updatedBrand;
        } catch (e) {
            throw new Error('Failed to edit: ' + e.message);
        }
    }

    async detailBrand(id: string): Promise<BrandDocument | null> {
        try {
            const detailBrand = await this.brandModel.findById(id).exec();
            return detailBrand;
        } catch (e) {
            throw new Error('Failed to get detail: ' + e.message);
        }
    }
}
