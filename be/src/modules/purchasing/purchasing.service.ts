import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Document, Model, Types } from 'mongoose';
import { PaginationDto } from 'src/global/global.dto';
import { GlobalService } from 'src/global/global.service';
import { IPaginationRes } from 'src/types/interfaces';
import { BaseResponse } from 'src/utils/base-response';
import { Purchasing, PurchasingItem, PurchasingItemDocument } from './purchasing.schema';
import { PurchasingItemDto, PurchasingMutationDTO } from './purchasing.dto';
import { Product } from '../product/product.schema';
import { Supplier } from '../supplier/supplier.schema';

@Injectable()
export class PurchasingService {

  constructor(
    private global: GlobalService,
    @InjectModel(Purchasing.name) private purchasingModel: Model<Purchasing>,
    @InjectModel(PurchasingItem.name) private purchasingItemModel: Model<PurchasingItemDocument>,
    @InjectModel(Supplier.name) private supplierModel: Model<Supplier>,
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) { }

  async createPurchasing(dto: PurchasingMutationDTO): Promise<(Purchasing & { items: PurchasingItem[] }) | undefined> {
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

    let total = 0;

    // Loop through each item and enrich data
    for (const item of dto.purchase_item) {
      await this.createPurchasingItem(item, purchase, supplier);
      const subtotal = item.qty * item.purchase_price;
      total += subtotal;
    }

    // Update total purchase price
    purchase.total_purchase_price = total;
    await purchase.save();
    return this.detailPurchasing(purchase._id);
  }

  async createPurchasingItem(data: PurchasingItemDto, po: Purchasing & Document, supplier: Supplier): Promise<PurchasingItem | undefined> {
    const product = await this.productModel.findById(data.product);
    if (!product) return BaseResponse.notFound({ err: `Product not found: ${data.product}` });

    const created = await this.purchasingItemModel.create({
      purchase_order: po._id,
      product: product._id,
      product_name: product.product_name,
      supplier_name: supplier.supplier_name,
      qty: data.qty,
      purchase_price: data.purchase_price,
      exp_date: data.exp_date,
    });

    return created || undefined
  }

  async editPurchasing(id: Types.ObjectId, dto: PurchasingMutationDTO): Promise<(Purchasing & { items: PurchasingItem[] }) | undefined> {
    try {
      const purchase = await this.purchasingModel.findById(id).exec();
      if (!purchase) return undefined;

      const supplier = await this.supplierModel.findById(dto.supplier).exec();
      if (!supplier) return BaseResponse.notFound({ err: 'Supplier not found' });

      // Fetch all existing items once
      const existingItems = await this.purchasingItemModel.find({
        purchase_order: id,
      }).exec();

      const dtoProductIds = dto.purchase_item.map(it => it.product);
      let total = 0;

      // Delete items that are no longer in the new DTO
      const toDelete = existingItems.filter(
        i => !dtoProductIds.includes(i.product.toString())
      );
      await this.purchasingItemModel.deleteMany({
        _id: { $in: toDelete.map(i => i._id) },
      });

      // Iterate over incoming items
      for (const dtoItem of dto.purchase_item) {
        const product = await this.productModel.findById(dtoItem.product);
        if (!product) return BaseResponse.notFound({ err: `Product not found: ${dtoItem.product}` });

        const existing = existingItems.find(
          i => i.product.toString() === dtoItem.product
        );

        if (existing) {
          // Update
          await this.editPurchasingItem(existing._id as Types.ObjectId, dtoItem, purchase, supplier);
        } else {
          // Create new
          await this.createPurchasingItem(dtoItem, purchase, supplier);
        }

        const subtotal = dtoItem.qty * dtoItem.purchase_price;
        total += subtotal;
      }

      // Update purchase main data
      purchase.supplier = supplier._id;
      purchase.supplier_name = supplier.supplier_name;
      purchase.total_purchase_price = total;
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

  async editPurchasingItem(id: Types.ObjectId, data: PurchasingItemDto, po: Purchasing & Document, supplier: Supplier): Promise<PurchasingItem | undefined> {
    const product = await this.productModel.findById(data.product);
    if (!product) return BaseResponse.notFound({ err: `Product not found: ${data.product}` });

    const updatedItem = await this.purchasingItemModel.findByIdAndUpdate(
      id,
      {
        $set:
        {
          purchase_order: po._id,
          product: product._id,
          product_name: product.product_name,
          supplier_name: supplier.supplier_name,
          qty: data.qty,
          purchase_price: data.purchase_price,
          exp_date: data.exp_date,
        }
      },
      {
        new: true,         // return the updated doc
        runValidators: true, // validate before saving
      },
    ).exec();
    return updatedItem || undefined;
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

  async detailPurchasing(id: Types.ObjectId): Promise<(Purchasing & { items: PurchasingItem[] }) | undefined> {
    const detailPurchasing = await this.purchasingModel
      .findById(id)
      .populate('supplier')
      .lean()
      .exec();

    if (!detailPurchasing) return undefined;

    const items = await this.purchasingItemModel
      .find({ purchase_order: id })
      .lean()
      .exec();

    return { ...detailPurchasing, items };
  }

  async deletePurchasing(id: Types.ObjectId): Promise<Purchasing | undefined> {
    try {
      const deletedPurchasing = await this.purchasingModel.findByIdAndDelete(id).exec();
      await this.purchasingItemModel.deleteMany({purchase_order: id});
      return deletedPurchasing || undefined;
    } catch (err) {
      return BaseResponse.unexpected({ err: { text: 'deletedPurchasing catch', err } })
    }
  }
}
