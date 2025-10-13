import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Document, Model, Types } from 'mongoose';
import { PaginationDto } from 'src/global/global.dto';
import { GlobalService } from 'src/global/global.service';
import { IPaginationRes } from 'src/types/interfaces';
import { BaseResponse } from 'src/utils/base-response';
import { Purchasing, PurchasingItem, PurchasingItemDocument } from './purchasing.schema';
import { ListPurchasingItemsDTO, PurchasingItemDto, PurchasingMutationDTO } from './purchasing.dto';
import { Product } from '../product/product.schema';
import { Supplier } from '../supplier/supplier.schema';

@Injectable()
export class PurchasingService {

  constructor(
    private global: GlobalService,
    @InjectModel(Purchasing.name) private purchasingModel: Model<Purchasing>,
    @InjectModel(PurchasingItem.name) private purchasingItemModel: Model<PurchasingItem>,
    @InjectModel(Supplier.name) private supplierModel: Model<Supplier>,
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) { }

  async createPurchasing(dto: PurchasingMutationDTO): Promise<(Purchasing & { items: { data: PurchasingItem[]; meta: IPaginationRes; } }) | undefined> {
    // Fetch supplier info
    const supplier = await this.supplierModel.findById(dto.supplier);
    if (!supplier) return BaseResponse.notFound({ err: 'Supplier not found' });

    // Create the purchase order
    const purchase = await this.purchasingModel.create({
      supplier: supplier._id,
      supplier_name: supplier.supplier_name,
      due_date: dto.due_date,
      status: 'created',
      total_purchase_price: 0,
    });

    const bulkPurchasingItems = await this.bulkUpdatePurchasingItems(purchase._id, dto.purchase_item);

    // Update total purchase price
    purchase.total_purchase_price = bulkPurchasingItems.total_price;
    await purchase.save();
    return this.detailPurchasing(purchase._id);
  }

  async createPurchasingItem(data: PurchasingItemDto): Promise<PurchasingItem | undefined> {
    const product = await this.productModel.findById(data.product);
    if (!product) return BaseResponse.notFound({ err: `createPurchasingItem Product not found: ${data.product_name}` });
    const created = await this.purchasingItemModel.create(data);
    return created || undefined
  }

  async editPurchasing(id: Types.ObjectId, dto: PurchasingMutationDTO): Promise<(Purchasing & { items: { data: PurchasingItem[]; meta: IPaginationRes; } }) | undefined> {
    try {
      const purchase = await this.purchasingModel.findById(id).exec();
      if (!purchase) return undefined;

      const supplier = await this.supplierModel.findById(dto.supplier).exec();
      if (!supplier) return BaseResponse.notFound({ err: 'Supplier not found' });

      const bulkPurchasingItems = await this.bulkUpdatePurchasingItems(id, dto.purchase_item);

      // Update purchase main data
      purchase.supplier = supplier._id;
      purchase.supplier_name = supplier.supplier_name;
      purchase.total_purchase_price = bulkPurchasingItems.total_price;
      purchase.status = dto.status;
      purchase.due_date = dto.due_date;
      purchase.invoice_number = dto.invoice_number || purchase.invoice_number;
      purchase.invoice_photo = dto.invoice_photo || purchase.invoice_photo;

      await purchase.save();
      return this.detailPurchasing(purchase._id);
    } catch (err) {
      return BaseResponse.unexpected({ err: { text: 'editPurchasing catch', err } });
    }
  }

  async editPurchasingItem(id: Types.ObjectId, data: PurchasingItemDto): Promise<PurchasingItem | undefined> {
    const product = await this.productModel.findById(data.product);
    if (!product) return BaseResponse.notFound({ err: `editPurchasingItem Product not found: ${data.product_name}` });

    const updatedItem = await this.purchasingItemModel.findByIdAndUpdate(
      id,
      { $set: data },
      {
        new: true,         // return the updated doc
        runValidators: true, // validate before saving
      },
    ).exec();
    return updatedItem || undefined;
  }

  async bulkUpdatePurchasingItems(purchasing_id: Types.ObjectId, data: PurchasingItemDto[]): Promise<{ data: PurchasingItem[]; meta: IPaginationRes; total_price: number }> {
    // Fetch all existing items once
    const existingItems = await this.purchasingItemModel.find({
      purchase_order: purchasing_id,
    }).exec();
    const dtoProductIds = data.map(it => it.product);
    let total_price = 0;
    // Delete items that are no longer in the new DTO
    const toDelete = existingItems.filter(
      i => !dtoProductIds.includes(i.product)
    );
    await this.purchasingItemModel.deleteMany({
      _id: { $in: toDelete.map(i => i._id) },
    });
    await Promise.all(data.map(async item => {
      const existing = existingItems.find(i => i.product === item.product);
      const data = { ...item, purchase_order: purchasing_id }
      if (existing) {
        // Update
        await this.editPurchasingItem(existing._id, data);
      } else {
        // Create new
        await this.createPurchasingItem(data);
      }
      const subtotal = item.qty * item.purchase_price;
      total_price += subtotal;
    }))
    const list = await this.listPurchasingItems({ purchasing_id })
    return { ...list, total_price }
  }

  async listPurchasing({
    page,
    size,
    sortBy,
    sortDir,
    search,
  }: PaginationDto): Promise<{ data: Purchasing[]; meta: IPaginationRes }> {
    const searchFields: string[] = ['supplier_name'];

    return this.global.getList<Purchasing>(
      this.purchasingModel,
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

  async detailPurchasing(purchasing_id: Types.ObjectId): Promise<(Purchasing & { items: { data: PurchasingItem[]; meta: IPaginationRes; } }) | undefined> {
    const detailPurchasing = await this.purchasingModel
      .findById(purchasing_id)
      .populate('supplier')
      .lean()
      .exec();

    if (!detailPurchasing) return undefined;

    const items = await this.listPurchasingItems({ purchasing_id });

    return { ...detailPurchasing, items };
  }

  async listPurchasingItems({
    purchasing_id,
    page,
    size,
    sortBy,
    sortDir,
    search,
  }: ListPurchasingItemsDTO): Promise<{ data: PurchasingItem[]; meta: IPaginationRes }> {
    const searchFields: string[] = ['product_name'];
    const filter: { column: string, value: any } = { column: 'purchase_order', value: purchasing_id }

    return this.global.getList<PurchasingItem>(
      this.purchasingItemModel,
      {
        page,
        size,
        sortBy,
        sortDir,
        search,
        searchFields,
        filter
      }
    )
  }

  async detailPurchasingItem(id: Types.ObjectId): Promise<PurchasingItem | undefined> {
    const detailPurchasing = await this.purchasingItemModel
      .findById(id)
      .populate('product')
      .lean()
      .exec();
    return detailPurchasing || undefined
  }

  async deletePurchasing(id: Types.ObjectId): Promise<Purchasing | undefined> {
    try {
      const deletedPurchasing = await this.purchasingModel.findByIdAndDelete(id).exec();
      await this.purchasingItemModel.deleteMany({ purchase_order: id });
      return deletedPurchasing || undefined;
    } catch (err) {
      return BaseResponse.unexpected({ err: { text: 'deletedPurchasing catch', err } })
    }
  }

  async deletePurchasingItem(id: Types.ObjectId): Promise<PurchasingItem | undefined> {
    try {
      const deletedPurchasingItem = await this.purchasingItemModel.findByIdAndDelete(id).exec();
      return deletedPurchasingItem || undefined;
    } catch (err) {
      return BaseResponse.unexpected({ err: { text: 'deletedPurchasingItem catch', err } })
    }
  }
}
