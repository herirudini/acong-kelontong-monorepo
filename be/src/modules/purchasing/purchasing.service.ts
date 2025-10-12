import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { PaginationDto } from 'src/global/global.dto';
import { GlobalService } from 'src/global/global.service';
import { IPaginationRes } from 'src/types/interfaces';
import { BaseResponse } from 'src/utils/base-response';
import { Purchasing, PurchasingItem, PurchasingItemDocument } from './purchasing.schema';
import { PurchasingMutationDTO } from './purchasing.dto';
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
      const product = await this.productModel.findById(item.product);
      if (!product) return BaseResponse.notFound({ err: `Product not found: ${item.product}` });

      const subtotal = item.qty * item.purchase_price;
      total += subtotal;

      await this.purchasingItemModel.create({
        purchase_order: purchase._id,
        product: product._id,
        product_name: product.product_name,
        supplier_name: supplier.supplier_name,
        qty: item.qty,
        purchase_price: item.purchase_price,
        exp_date: item.exp_date,
      });
    }

    // Update total purchase price
    purchase.total_purchase_price = total;
    await purchase.save();
    return this.detailPurchasing(purchase._id);
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

  async editPurchasing(id: string, dto: PurchasingMutationDTO): Promise<(Purchasing & { items: PurchasingItem[] }) | undefined> {
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

        const subtotal = dtoItem.qty * dtoItem.purchase_price;
        total += subtotal;

        const existing = existingItems.find(
          i => i.product.toString() === dtoItem.product
        );

        if (existing) {
          // Update if qty or price changed
          await this.purchasingItemModel.findByIdAndUpdate(existing._id, {
            qty: dtoItem.qty,
            purchase_price: dtoItem.purchase_price,
            exp_date: dtoItem.exp_date,
          });
        } else {
          // Create new if not exist
          await this.purchasingItemModel.create({
            purchase_order: purchase._id,
            product: product._id,
            product_name: product.product_name,
            supplier_name: supplier.supplier_name,
            qty: dtoItem.qty,
            purchase_price: dtoItem.purchase_price,
            exp_date: dtoItem.exp_date,
          });
        }
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

  async deletePurchasing(id: string): Promise<Purchasing | undefined> {
    try {
      const detailPurchasing = await this.purchasingModel.findByIdAndDelete(id).exec();
      return detailPurchasing || undefined;
    } catch (err) {
      return BaseResponse.unexpected({ err: { text: 'detailPurchasing catch', err } })
    }
  }
}
