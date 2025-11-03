import { ITableQueryData } from '../../shared/components/generic-table/generic-table';
import { IProduct } from './catalogue.interface';
import { InventoryEn } from './supplies.interface';

export interface ISupplier {
  _id?: string;
  supplier_name: string;
  supplier_phone?: string;
  supplier_email?: string;
}

export enum PurchasingEn {
  REQUEST = 'REQUEST',
  PROCESS = 'PROCESS',
  RECEIVE = 'RECEIVE',
  DROP = 'DROP',
}
export interface IPurchasingDto {
  supplier?: string;
  due_date?: Date;
  invoice_number?: string;
  invoice_photo?: string;
}
export interface IPurchasingItemDto {
  purchase_order: string;
  product: string;
  exp_date: string;
  purchase_qty: number;
  recieved_qty: number;
  purchase_price: number;
  sell_price: number;
}
export interface IProcessPurchaseOrderDto {
  invoice_number?: string;
  invoice_photo?: string;
  purchase_item: IPurchasingItemDto[];
}
export interface ReceiveOrderItemDto {
  purchase_item: string;
  status?: InventoryEn;
}
export interface IPurchasing {
  _id?: string;
  supplier: ISupplier;
  supplier_name: string;
  due_date: Date;
  status?: PurchasingEn;
  received_at?: Date;
  invoice_number?: string;
  invoice_photo?: string;
  total_purchase_price: number;
  items?: IPurchasingItem[];
}
export interface IPurchasingItem {
  _id?: string;
  product: IProduct;
  purchase_order: IPurchasing;
  product_name: string;
  supplier_name: string;
  purchase_qty: number;
  recieved_qty: number;
  purchase_price: number;
  sell_price: number;
  exp_date?: Date;
} 
export interface IListPurchasingItemsDTO extends ITableQueryData {
  purchasing_id: string;
}