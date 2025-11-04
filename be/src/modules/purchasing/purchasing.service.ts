import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { ClientSession, Connection, Model, Types } from 'mongoose';
import { PaginationDto } from 'src/global/global.dto';
import { GlobalService } from 'src/global/global.service';
import { IPaginationRes } from 'src/types/interfaces';
import { BaseResponse } from 'src/utils/base-response';
import { Purchasing, PurchasingEn } from './purchasing.schema';
import { ListPurchasingItemsDTO, PurchaseOrderDto, PurchasingDto, PurchasingItemDto } from './purchasing.dto';
import { Supplier } from '../supplier/supplier.schema';
import { InventoryService } from '../inventory/inventory.service';
import { PurchasingItem } from '../purchasing-item/purchasing-item.schema';
import { PurchasingItemService } from '../purchasing-item/purchasing-item.service';

@Injectable()
export class PurchasingService {

  constructor(
    private global: GlobalService,
    private inventory: InventoryService,
    private purchaseItemSvc: PurchasingItemService,
    @InjectModel(Purchasing.name) private purchasingModel: Model<Purchasing>,
    @InjectModel(PurchasingItem.name) private purchasingItemModel: Model<PurchasingItem>,
    @InjectModel(Supplier.name) private supplierModel: Model<Supplier>,
    @InjectConnection() private readonly connection: Connection,
  ) { }

  async createPurchasing(data: PurchasingDto & { status: PurchasingEn }): Promise<Purchasing | undefined> {
    const session = await this.connection.startSession();
    session.startTransaction();

    const supplier = await this.supplierModel.findById(data.supplier).session(session);
    if (!supplier) {
      await session.abortTransaction();
      throw BaseResponse.notFound({ err: 'Supplier not found' });
    }
    const purchase = await this.purchasingModel.create([{  // use array + session
      supplier: supplier._id,
      supplier_name: supplier.supplier_name,
      due_date: data.due_date,
      status: PurchasingEn.REQUEST,
      total_purchase_price: 0,
    }], { session });

    const createdPurchase = purchase[0];

    await createdPurchase.save({ session });
    await session.commitTransaction();
    await session.endSession();
    return this.detailPurchasing(createdPurchase._id);
  }

  async editPurchasing(id: Types.ObjectId, data: PurchasingDto & { status?: PurchasingEn }, sessionIn?: ClientSession): Promise<Purchasing | undefined> {
    return this.global.withTransaction(async (session) => {
      const purchase = await this.purchasingModel.findById(id).session(session);
      if (!purchase) throw BaseResponse.notFound({ err: 'Purchasing not found' });

      const supplier = await this.supplierModel.findById(data.supplier).session(session);
      if (!supplier) throw BaseResponse.notFound({ err: 'Supplier not found' });

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
        if (field === 'due_date' && data.due_date) purchase.due_date = data.due_date;
        if (field === 'invoice_number' && data.invoice_number) purchase.invoice_number = data.invoice_number;
        if (field === 'invoice_photo' && data.invoice_photo) purchase.invoice_photo = data.invoice_photo;
        if (field === 'status' && data.status) purchase.status = data.status;
      });

      await purchase.save({ session });
      return this.detailPurchasing(purchase._id);
    }, sessionIn);
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

  async detailPurchasing(purchasing_id: Types.ObjectId): Promise<Purchasing | undefined> {
    const detailPurchasing = await this.purchasingModel
      .findById(purchasing_id)
      .populate('supplier')
      .lean()
      .exec();
    return detailPurchasing || undefined;
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

  async deletePurchasing(id: Types.ObjectId, sessionIn?: ClientSession): Promise<Purchasing | undefined> {
    return this.global.withTransaction(async (session) => {
      const deletedPurchasing = await this.purchasingModel.findByIdAndDelete(id).session(session);
      await this.purchasingItemModel.deleteMany({ purchase_order: id }).session(session);
      return deletedPurchasing || undefined;
    }, sessionIn);
  }

  async bulkUpdatePurchasingItems(purchasing_id: Types.ObjectId, data: PurchasingItemDto[], sessionIn?: ClientSession): Promise<{ data: PurchasingItem[]; meta: IPaginationRes; }> {
    return this.global.withTransaction(async (session) => {
      const existingItems = await this.purchasingItemModel.find({
        purchase_order: purchasing_id,
      }).session(session);

      const dtoProductIds = data.map(it => it.product);

      const toDelete = existingItems.filter(
        i => !dtoProductIds.includes(i.product)
      );
      await this.purchasingItemModel.deleteMany({
        _id: { $in: toDelete.map(i => i._id) },
      }).session(session);

      await Promise.all(data.map(async item => {
        const existing = existingItems.find(i => i.product.toString() === item.product.toString());
        const newData = { ...item, purchase_order: purchasing_id };
        if (existing) {
          await this.purchaseItemSvc.editPurchasingItem(existing._id, newData, session);
        } else {
          await this.purchaseItemSvc.createPurchasingItem(newData, session);
        }
      }));

      const list = await this.listPurchasingItems({ purchasing_id });
      return list;
    }, sessionIn);
  }

  async purchaseOrder(id: Types.ObjectId, dto: PurchaseOrderDto): Promise<Purchasing | undefined> {
    return this.global.withTransaction(async (session) => {
      const purchase = await this.purchasingModel.findById(id).session(session);
      if (!purchase) {
        throw BaseResponse.notFound({ err: { text: 'purchaseOrder purchase not found' } });
      }
      if (purchase?.status !== PurchasingEn.REQUEST) {
        throw BaseResponse.forbidden({ err: { text: 'purchaseOrder invalid status purchase order' } })
      }
      const data = {
        ...dto,
        status: PurchasingEn.PROCESS
      }
      const updatedPurchase = await this.editPurchasing(id, data, session);
      if (!updatedPurchase) {
        throw BaseResponse.unexpected({ err: { text: 'purchaseOrder failed to editPurchasing' } });
      }
      return updatedPurchase
    });
  }

  async receiveOrder(id: Types.ObjectId, dto: PurchaseOrderDto): Promise<Purchasing | undefined> {
    return this.global.withTransaction(async (session) => {
      const purchase = await this.purchasingModel.findById(id).session(session);
      if (!purchase)
        throw BaseResponse.notFound({ err: { text: 'receiveOrder purchase not found' } });
      if (purchase.status !== PurchasingEn.PROCESS)
        throw BaseResponse.forbidden({ err: { text: 'receiveOrder invalid status' } });
      // ✅ Step 1: Update purchasing and its items
      const updatedPurchase = await this.editPurchasing(id, {
        ...dto,
        status: PurchasingEn.RECEIVE
      }, session);
      if (!updatedPurchase)
        throw BaseResponse.unexpected({ err: { text: 'receiveOrder failed to editPurchasing' } });
      // ✅ Step 2: Fetch items after update
      const purchaseItems = await this.purchasingItemModel.find({ purchase_order: id }).session(session);
      // ✅ Step 3: Safely loop and create inventory
      for (const item of purchaseItems) {
        await this.inventory.createInventory({ purchase_item: item._id }, session);
      }
      return updatedPurchase;
    });
  }
}
