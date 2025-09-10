import { Injectable } from '@nestjs/common';
import { Brand, BrandDocument } from './brand.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseResponse } from 'src/utils/base-response';

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
        } catch (err) {
            return BaseResponse.unexpected({ err: { text: 'listBrand catch', err } })
        }
    }

    async createBrand(data: Brand): Promise<BrandDocument> {
        try {
            const newBrand = await this.brandModel.create(data);
            return newBrand;
        } catch (err) {
            return BaseResponse.unexpected({ err: { text: 'createBrand catch', err } })
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
        } catch (err) {
            return BaseResponse.unexpected({ err: { text: 'editBrand catch', err } })
        }
    }

    async detailBrand(id: string): Promise<BrandDocument | null> {
        try {
            const detailBrand = await this.brandModel.findById(id).exec();
            return detailBrand;
        } catch (err) {
            return BaseResponse.unexpected({ err: { text: 'detailBrand catch', err } })
        }
    }
}
