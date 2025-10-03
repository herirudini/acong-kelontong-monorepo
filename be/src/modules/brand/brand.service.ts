import { Injectable } from '@nestjs/common';
import { Brand, BrandDocument } from './brand.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseResponse } from 'src/utils/base-response';
import { GlobalService } from 'src/global/global.service';
import { IPaginationRes } from 'src/types/interfaces';
import { PaginationDto } from 'src/global/global.dto';

@Injectable()
export class BrandService {
    constructor(
        @InjectModel(Brand.name) private readonly brandModel: Model<BrandDocument>,
        private global: GlobalService
    ) { }

    async listBrand({
        page,
        size,
        sortBy,
        sortDir,
        search,
    }: PaginationDto): Promise<{ data: BrandDocument[]; meta: IPaginationRes }> {
        const searchFields: string[] = ['brand_name'];

        return this.global.getList<Brand, BrandDocument>(
            this.brandModel,
            {
                page,
                size,
                sortBy,
                sortDir,
                search,
                searchFields,
            }
        )
    }

    async createBrand(data: Brand): Promise<BrandDocument> {
        try {
            const newBrand = await this.brandModel.create(data);
            return newBrand;
        } catch (err) {
            return BaseResponse.unexpected({ err: { text: 'createBrand catch', err } })
        }
    }

    async editBrand(id: string, data: Brand): Promise<BrandDocument | undefined> {
        try {
            const updatedBrand = await this.brandModel.findByIdAndUpdate(
                id,
                { $set: data },
                {
                    new: true,         // return the updated doc
                    runValidators: true, // validate before saving
                },
            ).exec();
            return updatedBrand || undefined;
        } catch (err) {
            return BaseResponse.unexpected({ err: { text: 'editBrand catch', err } })
        }
    }

    async detailBrand(id: string): Promise<BrandDocument | undefined> {
        try {
            const detailBrand = await this.brandModel.findById(id).exec();
            return detailBrand || undefined;
        } catch (err) {
            return BaseResponse.unexpected({ err: { text: 'detailBrand catch', err } })
        }
    }

    async deleteBrand(id: string): Promise<BrandDocument | undefined> {
        try {
            const detailBrand = await this.brandModel.findByIdAndDelete(id).exec();
            return detailBrand || undefined;
        } catch (err) {
            return BaseResponse.unexpected({ err: { text: 'detailBrand catch', err } })
        }
    }
}
