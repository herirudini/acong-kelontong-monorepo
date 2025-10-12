import { Injectable } from '@nestjs/common';
import { Supplier, SupplierDocument } from './supplier.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaginationDto } from 'src/global/global.dto';
import { GlobalService } from 'src/global/global.service';
import { IPaginationRes } from 'src/types/interfaces';
import { BaseResponse } from 'src/utils/base-response';

@Injectable()
export class SupplierService {
    constructor(
      @InjectModel(Supplier.name) private readonly supplierModel: Model<SupplierDocument>,
      private global: GlobalService
    ) { }

  async listSupplier({
    page,
    size,
    sortBy,
    sortDir,
    search,
  }: PaginationDto): Promise<{ data: SupplierDocument[]; meta: IPaginationRes }> {
    const searchFields: string[] = ['supplier_name'];

    return this.global.getList<Supplier, SupplierDocument>(
      this.supplierModel,
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

  async createSupplier(data: Supplier): Promise<SupplierDocument> {
    try {
      const newSupplier = await this.supplierModel.create(data);
      return newSupplier;
    } catch (err) {
      return BaseResponse.unexpected({ err: { text: 'createSupplier catch', err } })
    }
  }

  async editSupplier(id: string, data: Supplier): Promise<SupplierDocument | undefined> {
    try {
      const updatedSupplier = await this.supplierModel.findByIdAndUpdate(
        id,
        { $set: data },
        {
          new: true,         // return the updated doc
          runValidators: true, // validate before saving
        },
      ).exec();
      return updatedSupplier || undefined;
    } catch (err) {
      return BaseResponse.unexpected({ err: { text: 'editSupplier catch', err } })
    }
  }

  async detailSupplier(id: string): Promise<SupplierDocument | undefined> {
    try {
      const detailSupplier = await this.supplierModel.findById(id).exec();
      return detailSupplier || undefined;
    } catch (err) {
      return BaseResponse.unexpected({ err: { text: 'detailSupplier catch', err } })
    }
  }

  async deleteSupplier(id: string): Promise<SupplierDocument | undefined> {
    try {
      const detailSupplier = await this.supplierModel.findByIdAndDelete(id).exec();
      return detailSupplier || undefined;
    } catch (err) {
      return BaseResponse.unexpected({ err: { text: 'detailSupplier catch', err } })
    }
  }
}