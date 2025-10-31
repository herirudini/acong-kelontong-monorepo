import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model, Types } from 'mongoose';
import { PaginationDto } from 'src/global/global.dto';
import { GlobalService } from 'src/global/global.service';
import { IPaginationRes } from 'src/types/interfaces';
import { BaseResponse } from 'src/utils/base-response';
import { Purchasing, PurchasingEn, PurchasingItem } from './purchasing.schema';
import { ListPurchasingItemsDTO, PurchasingItemDto, PurchaseOrderDto, PurchasingDto, ReceiveOrderItemDto } from './purchasing.dto';
import { Product } from '../product/product.schema';
import { Supplier } from '../supplier/supplier.schema';
import { InventoryService } from '../inventory/inventory.service';

@Injectable()
export class PurchasingService {

  constructor(
    private global: GlobalService,
    private inventory: InventoryService,
    @InjectModel(Purchasing.name) private purchasingModel: Model<Purchasing>,
    @InjectModel(PurchasingItem.name) private purchasingItemModel: Model<PurchasingItem>,
    @InjectModel(Supplier.name) private supplierModel: Model<Supplier>,
    @InjectModel(Product.name) private productModel: Model<Product>,
    @InjectConnection() private readonly connection: Connection,
  ) { }

  async createPurchasing(data: PurchasingDto & { status: PurchasingEn }): Promise<(Purchasing & { items: { data: PurchasingItem[]; meta: IPaginationRes; } }) | undefined> {
    // Fetch supplier info
    const supplier = await this.supplierModel.findById(data.supplier);
    if (!supplier) return BaseResponse.notFound({ err: 'Supplier not found' });

    // Create the purchase order
    const purchase = await this.purchasingModel.create({
      supplier: supplier._id,
      supplier_name: supplier.supplier_name,
      due_date: data.due_date,
      status: 'created',
      total_purchase_price: 0,
    });

    let total_price = 0;
    if (data.purchase_item && data.purchase_item.length > 0) {
      total_price = (await this.bulkUpdatePurchasingItems(purchase._id, data.purchase_item)).total_price;
    }

    // Update total purchase price
    purchase.total_purchase_price = total_price;
    await purchase.save();
    return this.detailPurchasing(purchase._id);
  }

  async createPurchasingItem(data: PurchasingItemDto): Promise<PurchasingItem | undefined> {
    const product = await this.productModel.findById(data.product);
    if (!product) return BaseResponse.notFound({ err: `createPurchasingItem Product not found: ${data.product_name}` });
    const created = await this.purchasingItemModel.create(data);
    return created || undefined
  }

  async editPurchasing(id: Types.ObjectId, data: PurchasingDto & { status?: PurchasingEn }): Promise<(Purchasing & { items: { data: PurchasingItem[]; meta: IPaginationRes; } }) | undefined> {
    try {
      const purchase = await this.purchasingModel.findById(id).exec();
      if (!purchase) return undefined;

      const supplier = await this.supplierModel.findById(data.supplier).exec();
      if (!supplier) return BaseResponse.notFound({ err: 'Supplier not found' });

      let totalPrice = 0;
      if (data.purchase_item && data.purchase_item.length > 0) {
        totalPrice = (await this.bulkUpdatePurchasingItems(id, data.purchase_item)).total_price;
      }

      const statDrop = ['status']
      const statReceive = [...statDrop, 'invoice_number', 'invoice_photo']
      const statProcess = [...statReceive, 'due_date']
      const statRequest = [...statProcess, 'total_purchase_price', 'supplier_name', 'supplier']

      let fields: string[];
      switch (purchase.status) {
        case PurchasingEn.DROP:
          fields = statDrop;
          break;
        case PurchasingEn.RECEIVE:
          fields = statReceive;
          break;
        case PurchasingEn.PROCESS:
          fields = statProcess;
          break;
        default:
          fields = statRequest
      }

      fields.forEach((field: string) => {
        if (field === 'supplier' && supplier._id) purchase.supplier = supplier._id;
        if (field === 'supplier_name' && supplier.supplier_name) purchase.supplier_name = supplier.supplier_name;
        if (field === 'total_purchase_price') purchase.total_purchase_price = totalPrice;
        if (field === 'due_date' && data.due_date) purchase.due_date = data.due_date;
        if (field === 'invoice_number' && data.invoice_number) purchase.invoice_number = data.invoice_number;
        if (field === 'invoice_photo' && data.invoice_photo) purchase.invoice_photo = data.invoice_photo;
        if (field === 'status' && data.status) purchase.status = data.status;
      });

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
      .populate(['purchase_order', 'product'])
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

  async purchaseOrder(id: Types.ObjectId, dto: PurchaseOrderDto): Promise<(Purchasing & { items: { data: PurchasingItem[]; meta: IPaginationRes; } }) | undefined> {
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      const purchase = await this.purchasingModel.findById(id).session(session);
      if (!purchase) {
        await session.abortTransaction();
        return BaseResponse.notFound({ err: { text: 'purchaseOrder purchase not found' } });
      }

      if (purchase?.status !== PurchasingEn.REQUEST) {
        await session.abortTransaction();
        return BaseResponse.forbidden({ err: { text: 'purchaseOrder invalid status purchase order' } })
      }

      const data = {
        ...dto,
        status: PurchasingEn.PROCESS
      }
      const updatedPurchase = await this.editPurchasing(id, data);
      if (!updatedPurchase) {
        await session.abortTransaction();
        return BaseResponse.unexpected({ err: { text: 'purchaseOrder failed to editPurchasing' } });
      }

      await session.commitTransaction();
      await session.endSession();

      return updatedPurchase
    } catch (err) {
      await session.abortTransaction();
      await session.endSession();
      return BaseResponse.unexpected({ err: { text: 'purchaseOrder transaction failed', err } });
    }
  }

  async receiveOrder(id: Types.ObjectId, dto: PurchaseOrderDto): Promise<(Purchasing & { items: { data: PurchasingItem[]; meta: IPaginationRes; } }) | undefined> {
    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      const purchase = await this.purchasingModel.findById(id).session(session);
      if (!purchase) {
        await session.abortTransaction();
        return BaseResponse.notFound({ err: { text: 'receiveOrder purchase not found' } });
      }

      if (purchase.status !== PurchasingEn.PROCESS) {
        await session.abortTransaction();
        return BaseResponse.forbidden({ err: { text: 'receiveOrder invalid status' } });
      }

      // ✅ Step 1: Update purchasing + items using your existing editPurchasing
      const data = {
        ...dto,
        status: PurchasingEn.RECEIVE,
      };

      const updatedPurchase = await this.editPurchasing(id, data);
      if (!updatedPurchase) {
        await session.abortTransaction();
        return BaseResponse.unexpected({ err: { text: 'receiveOrder failed to editPurchasing' } });
      }

      // ✅ Step 2: Fetch purchase items again after update (so received_qty is fresh)
      const purchaseItems = await this.purchasingItemModel
        .find({ purchase_order: id })
        .session(session);

      // ✅ Step 3: Create inventory for each item
      for (const item of purchaseItems) {
        try {
          const itemToInvent = { purchase_item: item._id };
          await this.inventory.createInventory(itemToInvent, session);
        } catch (err) {
          await session.abortTransaction();
          await session.endSession();
          return BaseResponse.unexpected({ err: { text: 'receiveOrder.createInventory failed', err } });
        }
      }

      // ✅ Step 4: Commit if everything succeeds
      await session.commitTransaction();
      await session.endSession();

      return updatedPurchase;
    } catch (err) {
      await session.abortTransaction();
      await session.endSession();
      return BaseResponse.unexpected({ err: { text: 'receiveOrder transaction failed', err } });
    }
  }
}
