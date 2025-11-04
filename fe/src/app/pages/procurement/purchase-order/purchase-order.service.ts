import { Injectable } from '@angular/core';
import { BaseService } from '../../../services/rest-api/base-service';
import { AlertService } from '../../../shared/components/alert/alert-service';
import { catchError, map, Observable, of } from 'rxjs';
import { Endpoint } from '../../../types/constants/endpoint';
import { IPaginationInput } from '../../../types/interfaces/common.interface';
import { IResDetail, IResList } from '../../../types/interfaces/http.interface';
import { ITableQueryData } from '../../../shared/components/generic-table/generic-table';
import { IPurchasing, IPurchasingItem, IPurchasingItemDto } from '../../../types/interfaces/procurement.interface';

@Injectable({
  providedIn: 'root'
})
export class PurchaseOrderService extends BaseService {
  constructor(private alert: AlertService) {
    super();
  }

  getPurchasings(
    qParams: ITableQueryData
  ): Observable<IResList<IPurchasing>> {
    return this.getRequest({ url: Endpoint.PURCHASING, qParams, spinner: false }).pipe(
      map((res: IResList<IPurchasing>) => {
        const val = {
          meta: res?.meta as IPaginationInput,
          list: res?.list
        };
        return val;
      }),
      catchError((err) => {
        console.error(err);
        this.alert.error('Cannot get list purchasing');
        throw new Error(err);
      })
    ) as any;
  }

  createPurchasing(
    body: FormData //refers to IPurchasingDto
  ): Observable<IPurchasing> {
    return this.postRequest({ url: Endpoint.PURCHASING, body }).pipe(
      map((res: IResDetail<IPurchasing>) => {
        return res.detail;
      }),
      catchError((err) => {
        console.error(err);
        this.alert.error('Cannot create purchasing');
        throw new Error(err);
      })
    ) as any;
  }

  editPurchasing(
    purchasing_id: string,
    body: FormData //refers to IPurchasingDto
  ): Observable<IPurchasing> {
    return this.putRequest({ url: Endpoint.PURCHASING_ID(purchasing_id), body }).pipe(
      map((res: IResDetail<IPurchasing>) => {
        return res.detail;
      }),
      catchError((err) => {
        console.error(err);
        this.alert.error('Cannot edit purchasing');
        throw new Error(err);
      })
    ) as any;
  }

  getPurchasingDetail(purchasing_id: string): Observable<IPurchasing> {
    return this.getRequest({ url: Endpoint.PURCHASING_ID(purchasing_id) }).pipe(
      map((res: IResDetail<IPurchasing>) => {
        return res.detail;
      }),
      catchError((err) => {
        console.error(err);
        this.alert.error('Cannot get purchasing detail');
        throw new Error(err);
      })
    ) as any;
  }

  deletePurchasing(purchasing_id: string): Observable<IPurchasing> {
    return this.deleteRequest({ url: Endpoint.PURCHASING_ID(purchasing_id) }).pipe(
      map((res: IResDetail<IPurchasing>) => {
        return res.detail;
      }),
      catchError((err) => {
        console.error(err);
        this.alert.error('Cannot delete purchasing');
        throw new Error(err);
      })
    ) as any;
  }

  getPurchasingItems(
    purchasing_id: string,
    qParams: ITableQueryData
  ): Observable<IResList<IPurchasingItem>> {
    return this.getRequest({ url: Endpoint.PURCHASING_ID(purchasing_id) + '/items', qParams, spinner: false }).pipe(
      map((res: IResList<IPurchasingItem>) => {
        const val = {
          meta: res?.meta as IPaginationInput,
          list: res?.list
        };
        return val;
      }),
      catchError((err) => {
        console.error(err);
        this.alert.error('Cannot get list purchasing');
        throw new Error(err);
      })
    ) as any;
  }

  createPurchaseItem(
    body: IPurchasingItemDto
  ): Observable<IPurchasingItem> {
    return this.postRequest({ url: Endpoint.PURCHASING_ITEM, body }).pipe(
      map((res: IResDetail<IPurchasingItem>) => {
        return res.detail;
      }),
      catchError((err) => {
        console.error(err);
        this.alert.error('Cannot create purchase item');
        throw new Error(err);
      })
    ) as any;
  }

  editPurchaseItem(
    purchase_item_id: string,
    body: IPurchasingItemDto
  ): Observable<IPurchasingItem> {
    return this.putRequest({ url: Endpoint.PURCHASING_ITEM_ID(purchase_item_id), body }).pipe(
      map((res: IResDetail<IPurchasingItem>) => {
        return res.detail;
      }),
      catchError((err) => {
        console.error(err);
        this.alert.error('Cannot edit purchase item');
        throw new Error(err);
      })
    ) as any;
  }

  getPurchaseItemDetail(purchase_item_id: string): Observable<IPurchasingItem> {
    return this.getRequest({ url: Endpoint.PURCHASING_ITEM_ID(purchase_item_id) }).pipe(
      map((res: IResDetail<IPurchasingItem>) => {
        return res.detail;
      }),
      catchError((err) => {
        console.error(err);
        this.alert.error('Cannot get purchase item detail');
        throw new Error(err);
      })
    ) as any;
  }

  deletePurchaseItem(purchase_item_id: string): Observable<IPurchasingItem> {
    return this.deleteRequest({ url: Endpoint.PURCHASING_ITEM_ID(purchase_item_id) }).pipe(
      map((res: IResDetail<IPurchasingItem>) => {
        return res.detail;
      }),
      catchError((err) => {
        console.error(err);
        this.alert.error('Cannot delete purchase item');
        throw new Error(err);
      })
    ) as any;
  }
}

