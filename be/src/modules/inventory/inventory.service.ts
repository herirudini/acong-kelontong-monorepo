import { Injectable } from '@nestjs/common';
import { Inventory } from './inventory.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { PaginationDto } from 'src/global/global.dto';
import { GlobalService } from 'src/global/global.service';
import { IPaginationRes } from 'src/types/interfaces';
import { BaseResponse } from 'src/utils/base-response';
import { EditInventoryDto, ReceiveOrderDto } from './inventory.dto';

@Injectable()
export class InventoryService {
    constructor(
      @InjectModel(Inventory.name) private readonly inventoryModel: Model<Inventory>,
      private global: GlobalService
    ) { }

  async listInventory({
    page,
    size,
    sortBy,
    sortDir,
    search,
  }: PaginationDto): Promise<{ data: Inventory[]; meta: IPaginationRes }> {
    const searchFields: string[] = ['product_name'];

    return this.global.getList<Inventory>(
      this.inventoryModel,
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

  async createInventory(data: ReceiveOrderDto): Promise<Inventory> {
    try {
      const newInventory = await this.inventoryModel.create(data);
      return newInventory;
    } catch (err) {
      return BaseResponse.unexpected({ err: { text: 'createInventory catch', err } })
    }
  }

  async editInventory(id: Types.ObjectId, data: EditInventoryDto): Promise<Inventory | undefined> {
    try {
      const updatedInventory = await this.inventoryModel.findByIdAndUpdate(
        id,
        { $set: data },
        {
          new: true,         // return the updated doc
          runValidators: true, // validate before saving
        },
      ).exec();
      return updatedInventory || undefined;
    } catch (err) {
      return BaseResponse.unexpected({ err: { text: 'editInventory catch', err } })
    }
  }

  async detailInventory(id: Types.ObjectId): Promise<Inventory | undefined> {
    try {
      const detailInventory = await this.inventoryModel.findById(id)
      .populate(['purchase_item', 'product'])
      .lean()
      .exec();
      return detailInventory || undefined;
    } catch (err) {
      return BaseResponse.unexpected({ err: { text: 'detailInventory catch', err } })
    }
  }

  async deleteInventory(id: Types.ObjectId): Promise<Inventory | undefined> {
    try {
      const detailInventory = await this.inventoryModel.findByIdAndDelete(id).exec();
      return detailInventory || undefined;
    } catch (err) {
      return BaseResponse.unexpected({ err: { text: 'detailInventory catch', err } })
    }
  }
}
