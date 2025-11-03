import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { ClientSession, Connection, Model, Types } from 'mongoose';
import { PaginationDto } from 'src/global/global.dto';
import { GlobalService } from 'src/global/global.service';
import { IPaginationRes } from 'src/types/interfaces';
import { BaseResponse } from 'src/utils/base-response';
import { Purchasing, PurchasingEn, PurchasingItem } from './purchasing.schema';
import { ListPurchasingItemsDTO, PurchasingItemDto, PurchaseOrderDto, PurchasingDto } from './purchasing.dto';
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
      status: PurchasingEn.REQUEST,
      total_purchase_price: 0,
    }], { session });

    const createdPurchase = purchase[0];

    await createdPurchase.save({ session });
    await session.commitTransaction();
    await session.endSession();
    return this.detailPurchasing(createdPurchase._id);
  }


  async createPurchasingItem(dto: PurchasingItemDto, sessionIn?: ClientSession): Promise<PurchasingItem | undefined> {
    return this.global.withTransaction(async (session) => {
      const product = await this.productModel.findById(dto.product).session(session);
      if (!product) {
        return BaseResponse.notFound({ err: `createPurchasingItem Product not found` });
      }
      const purchasing = await this.purchasingModel.findById(dto.purchase_order).session(session);
      if (!purchasing) {
        return BaseResponse.notFound({ err: `createPurchasingItem Purchasing not found` });
      }
      const data = {
        ...dto,
        supplier_name: purchasing.supplier_name,
        product_name: product.product_name,
      }
      const created = (await this.purchasingItemModel.create([data], { session }))[0];
      if (!created) return BaseResponse.notFound({ err: 'editPurchasingItem created not found' });
      await this.updatePurchasingTotalPrice(created?.purchase_order, session);
      return created;
    }, sessionIn)
  }


  async editPurchasing(id: Types.ObjectId, data: PurchasingDto & { status?: PurchasingEn }, sessionIn?: ClientSession): Promise<(Purchasing & { items: { data: PurchasingItem[]; meta: IPaginationRes; } }) | undefined> {
    return this.global.withTransaction(async (session) => {
      const purchase = await this.purchasingModel.findById(id).session(session);
      if (!purchase) return BaseResponse.notFound({ err: 'Purchasing not found' });

      const supplier = await this.supplierModel.findById(data.supplier).session(session);
      if (!supplier) return BaseResponse.notFound({ err: 'Supplier not found' });

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

  async editPurchasingItem(
    id: Types.ObjectId,
    dto: PurchasingItemDto,
    sessionIn?: ClientSession
  ): Promise<PurchasingItem | undefined> {
    return this.global.withTransaction(async (session) => {
      const purchasing = await this.purchasingModel.findById(dto.purchase_order).session(session);
      if (!purchasing) {
        return BaseResponse.notFound({ err: `editPurchasingItem Purchasing not found` });
      }
      const product = await this.productModel.findById(dto.product).session(session);
      if (!product) return BaseResponse.notFound({ err: `editPurchasingItem Product not found` });
      const data = {
        ...dto,
        supplier_name: purchasing.supplier_name,
        product_name: product.product_name,
      }
      const updatedItem = await this.purchasingItemModel.findByIdAndUpdate(
        id,
        { $set: data },
        {
          new: true,
          runValidators: true,
        },
      ).session(session);
      if (!updatedItem) return BaseResponse.notFound({ err: 'editPurchasingItem updatedItem not found' });
      await this.updatePurchasingTotalPrice(updatedItem?.purchase_order, session);
      return updatedItem || undefined;
    }, sessionIn);
  }

  async bulkUpdatePurchasingItems(
    purchasing_id: Types.ObjectId,
    data: PurchasingItemDto[],
    sessionIn?: ClientSession
  ): Promise<{ data: PurchasingItem[]; meta: IPaginationRes; total_price: number }> {
    return this.global.withTransaction(async (session) => {
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
        const existing = existingItems.find(i => i.product.toString() === item.product.toString());
        const newData = { ...item, purchase_order: purchasing_id };
        if (existing) {
          await this.editPurchasingItem(existing._id, newData, session);
        } else {
          await this.createPurchasingItem(newData, session);
        }
        total_price += item.purchase_qty * item.purchase_price;
      }));
      const list = await this.listPurchasingItems({ purchasing_id });
      return { ...list, total_price };
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

  async deletePurchasing(id: Types.ObjectId, sessionIn?: ClientSession): Promise<Purchasing | undefined> {
    return this.global.withTransaction(async (session) => {
      const deletedPurchasing = await this.purchasingModel.findByIdAndDelete(id).session(session);
      await this.purchasingItemModel.deleteMany({ purchase_order: id }).session(session);
      return deletedPurchasing || undefined;
    }, sessionIn);
  }

  async deletePurchasingItem(id: Types.ObjectId, sessionIn?: ClientSession): Promise<PurchasingItem | undefined> {
    return this.global.withTransaction(async (session) => {
      const deletedPurchasingItem = await this.purchasingItemModel.findByIdAndDelete(id).session(session);
      if (!deletedPurchasingItem) return BaseResponse.notFound({ err: 'deletePurchasingItem not found' });
      await this.updatePurchasingTotalPrice(deletedPurchasingItem?.purchase_order, session);
      return deletedPurchasingItem || undefined;
    }, sessionIn);
  }

  async updatePurchasingTotalPrice(purchase_order: Types.ObjectId, sessionIn?: ClientSession): Promise<Purchasing | undefined> {
    return this.global.withTransaction(async (session) => {
      const purchase = await this.purchasingModel.findById(purchase_order).session(session);
      if (!purchase) return BaseResponse.notFound({ err: 'Purchasing not found' });
      const items = await this.purchasingItemModel.find({ purchase_order: purchase_order }).session(session).lean();
      if (!items || items.length < 1) {
        return undefined;
      }
      const total_price = items.reduce((sum, item) => sum + item.purchase_qty * item.purchase_price, 0);
      purchase.total_purchase_price = total_price;
      const result = await purchase.save({ session });
      return result
    }, sessionIn)
  }

  async purchaseOrder(id: Types.ObjectId, dto: PurchaseOrderDto): Promise<(Purchasing & { items: { data: PurchasingItem[]; meta: IPaginationRes; } }) | undefined> {
    return this.global.withTransaction(async (session) => {
      const purchase = await this.purchasingModel.findById(id).session(session);
      if (!purchase) {
        return BaseResponse.notFound({ err: { text: 'purchaseOrder purchase not found' } });
      }
      if (purchase?.status !== PurchasingEn.REQUEST) {
        return BaseResponse.forbidden({ err: { text: 'purchaseOrder invalid status purchase order' } })
      }
      const data = {
        ...dto,
        status: PurchasingEn.PROCESS
      }
      const updatedPurchase = await this.editPurchasing(id, data, session);
      if (!updatedPurchase) {
        return BaseResponse.unexpected({ err: { text: 'purchaseOrder failed to editPurchasing' } });
      }
      return updatedPurchase
    });
  }

  async receiveOrder(
    id: Types.ObjectId,
    dto: PurchaseOrderDto
  ): Promise<(Purchasing & { items: { data: PurchasingItem[]; meta: IPaginationRes } }) | undefined> {
    return this.global.withTransaction(async (session) => {
      const purchase = await this.purchasingModel.findById(id).session(session);
      if (!purchase)
        return BaseResponse.notFound({ err: { text: 'receiveOrder purchase not found' } });
      if (purchase.status !== PurchasingEn.PROCESS)
        return BaseResponse.forbidden({ err: { text: 'receiveOrder invalid status' } });
      // ✅ Step 1: Update purchasing and its items
      const updatedPurchase = await this.editPurchasing(id, {
        ...dto,
        status: PurchasingEn.RECEIVE
      }, session);
      if (!updatedPurchase)
        return BaseResponse.unexpected({ err: { text: 'receiveOrder failed to editPurchasing' } });
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
