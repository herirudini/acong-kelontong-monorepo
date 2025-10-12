import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaginationDto } from 'src/global/global.dto';
import { GlobalService } from 'src/global/global.service';
import { IPaginationRes } from 'src/types/interfaces';
import { BaseResponse } from 'src/utils/base-response';
import { Product, ProductDocument } from './product.schema';

@Injectable()
export class ProductService {

  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<ProductDocument>,
    private global: GlobalService
  ) { }

  async listProduct({
    page,
    size,
    sortBy,
    sortDir,
    search,
  }: PaginationDto): Promise<{ data: ProductDocument[]; meta: IPaginationRes }> {
    const searchFields: string[] = ['product_name'];

    return this.global.getList<Product, ProductDocument>(
      this.productModel,
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

  async createProduct(data: Product): Promise<ProductDocument> {
    try {
      const newProduct = await this.productModel.create(data);
      return newProduct;
    } catch (err) {
      return BaseResponse.unexpected({ err: { text: 'createProduct catch', err } })
    }
  }

  async editProduct(id: string, data: Product): Promise<ProductDocument | undefined> {
    try {
      const updatedProduct = await this.productModel.findByIdAndUpdate(
        id,
        { $set: data },
        {
          new: true,         // return the updated doc
          runValidators: true, // validate before saving
        },
      ).exec();
      return updatedProduct || undefined;
    } catch (err) {
      return BaseResponse.unexpected({ err: { text: 'editProduct catch', err } })
    }
  }

  async detailProduct(id: string): Promise<ProductDocument | undefined> {
    try {
      const detailProduct = await this.productModel.findById(id).exec();
      return detailProduct || undefined;
    } catch (err) {
      return BaseResponse.unexpected({ err: { text: 'detailProduct catch', err } })
    }
  }

  async deleteProduct(id: string): Promise<ProductDocument | undefined> {
    try {
      const detailProduct = await this.productModel.findByIdAndDelete(id).exec();
      return detailProduct || undefined;
    } catch (err) {
      return BaseResponse.unexpected({ err: { text: 'detailProduct catch', err } })
    }
  }
}
