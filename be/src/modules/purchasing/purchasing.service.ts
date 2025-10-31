import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { ClientSession, Connection, Model, Types } from 'mongoose';
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

  async createPurchasing(
    data: PurchasingDto & { status: PurchasingEn }
  ): Promise<(Purchasing & { items: { data: PurchasingItem[]; meta: IPaginationRes } }) | undefined> {
    const session = await this.connection.startSession();
    session.startTransaction();

    const supplier = await this.supplierModel.findById(data.supplier).session(session);
    if (!supplier) {
      await session.abortTransaction();
      return BaseResponse.notFound({ err: 'Supplier not found' });
    }
    const purchase = await this.purchasingModel.create([{  // use array + session
      supplier: supplier._id,
      supplier_name: supplier.supplier_name,
      due_date: data.due_date,
      status: 'created',
      total_purchase_price: 0,
    }], { session });

    const createdPurchase = purchase[0];

    let total_price = 0;
    if (data.purchase_item && data.purchase_item.length > 0) {
      total_price = (await this.bulkUpdatePurchasingItems(createdPurchase._id, data.purchase_item, session)).total_price;
    }

    createdPurchase.total_purchase_price = total_price;
    await createdPurchase.save({ session });
    await session.commitTransaction();
    await session.endSession();
    return this.detailPurchasing(createdPurchase._id);
  }


  async createPurchasingItem(data: PurchasingItemDto, sessionIn: ClientSession): Promise<PurchasingItem | undefined> {
    const session = sessionIn ? sessionIn : await this.connection.startSession();
    if (!sessionIn) session.startTransaction();
    const product = await this.productModel.findById(data.product).session(session);
    if (!product) return BaseResponse.notFound({ err: `createPurchasingItem Product not found: ${data.product_name}` });
    const created = (await this.purchasingItemModel.create([data, { session }]))[0];
    if (!sessionIn) {
      await session.commitTransaction();
      await session.endSession();
    }
    return created || undefined
  }

  async editPurchasing(id: Types.ObjectId, data: PurchasingDto & { status?: PurchasingEn }, sessionIn: ClientSession): Promise<(Purchasing & { items: { data: PurchasingItem[]; meta: IPaginationRes; } }) | undefined> {
    const session = sessionIn ? sessionIn : await this.connection.startSession();
    if (!sessionIn) session.startTransaction();
    try {
      const purchase = await this.purchasingModel.findById(id).session(session);
      if (!purchase) return undefined;

      const supplier = await this.supplierModel.findById(data.supplier).session(session);
      if (!supplier) return BaseResponse.notFound({ err: 'Supplier not found' });

      let totalPrice = 0;
      if (data.purchase_item && data.purchase_item.length > 0) {
        totalPrice = (await this.bulkUpdatePurchasingItems(id, data.purchase_item, session)).total_price;
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

      await purchase.save({ session });
      if (!sessionIn) {
        await session.commitTransaction();
        await session.endSession();
      }
      return this.detailPurchasing(purchase._id);
    } catch (err) {
      if (!sessionIn) {
        if (!sessionIn) await session.abortTransaction();
        await session.endSession();
      }
      return BaseResponse.unexpected({ err: { text: 'editPurchasing catch', err } });
    } finally {
      if (!sessionIn) await session.endSession();
    }
  }

  async editPurchasingItem(
    id: Types.ObjectId,
    data: PurchasingItemDto,
    sessionIn: ClientSession
  ): Promise<PurchasingItem | undefined> {
    const session = sessionIn ? sessionIn : await this.connection.startSession();
    if (!sessionIn) session.startTransaction();
    const product = await this.productModel.findById(data.product).session(session);
    if (!product) return BaseResponse.notFound({ err: `Product not found: ${data.product_name}` });

    const updatedItem = await this.purchasingItemModel.findByIdAndUpdate(
      id,
      { $set: data },
      {
        new: true,
        runValidators: true,
      },
    ).session(session);
    if (!sessionIn) {
      await session.commitTransaction();
      await session.endSession();
    }
    return updatedItem || undefined;
  }

  async bulkUpdatePurchasingItems(
    purchasing_id: Types.ObjectId,
    data: PurchasingItemDto[],
    sessionIn: ClientSession
  ): Promise<{ data: PurchasingItem[]; meta: IPaginationRes; total_price: number }> {
    const session = sessionIn ? sessionIn : await this.connection.startSession();
    if (!sessionIn) session.startTransaction();
    const existingItems = await this.purchasingItemModel.find({
      purchase_order: purchasing_id,
    }).session(session);

    const dtoProductIds = data.map(it => it.product);
    let total_price = 0;

    const toDelete = existingItems.filter(
      i => !dtoProductIds.includes(i.product)
    );
    await this.purchasingItemModel.deleteMany({
      _id: { $in: toDelete.map(i => i._id) },
    }).session(session);

    await Promise.all(data.map(async item => {
      const existing = existingItems.find(i => i.product === item.product);
      const newData = { ...item, purchase_order: purchasing_id };
      if (existing) {
        await this.editPurchasingItem(existing._id, newData, session);
      } else {
        await this.createPurchasingItem(newData, session);
      }
      total_price += item.qty * item.purchase_price;
    }));

    if (!sessionIn) {
      await session.commitTransaction();
      await session.endSession();
    }
    const list = await this.listPurchasingItems({ purchasing_id });
    return { ...list, total_price };
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

  async deletePurchasing(id: Types.ObjectId, sessionIn: ClientSession): Promise<Purchasing | undefined> {
    const session = sessionIn ? sessionIn : await this.connection.startSession();
    if (!sessionIn) session.startTransaction();
    try {
      const deletedPurchasing = await this.purchasingModel.findByIdAndDelete(id).session(session);
      await this.purchasingItemModel.deleteMany([{ purchase_order: id }], { session });
      if (!sessionIn) {
        await session.commitTransaction();
        await session.endSession();
      }
      return deletedPurchasing || undefined;
    } catch (err) {
      if (!sessionIn) {
        await session.abortTransaction();
        await session.endSession();
      }
      return BaseResponse.unexpected({ err: { text: 'deletedPurchasing catch', err } })
    } finally {
      if (!sessionIn) await session.endSession();
    }
  }

  async deletePurchasingItem(id: Types.ObjectId, sessionIn: ClientSession): Promise<PurchasingItem | undefined> {
    const session = sessionIn ? sessionIn : await this.connection.startSession();
    if (!sessionIn) session.startTransaction();
    try {
      const deletedPurchasingItem = await this.purchasingItemModel.findByIdAndDelete(id).session(session);
      if (!sessionIn) {
        await session.commitTransaction();
        await session.endSession();
      }
      return deletedPurchasingItem || undefined;
    } catch (err) {
      if (!sessionIn) {
        await session.abortTransaction();
        await session.endSession();
      }
      return BaseResponse.unexpected({ err: { text: 'deletedPurchasingItem catch', err } })
    } finally {
      if (!sessionIn) await session.endSession();
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
      const updatedPurchase = await this.editPurchasing(id, data, session);
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
    } finally {
      await session.endSession();
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

      const updatedPurchase = await this.editPurchasing(id, data, session);
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
        } finally {
          await session.endSession();
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
    } finally {
      await session.endSession();
    }
  }

  
}
