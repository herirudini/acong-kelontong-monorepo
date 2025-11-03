import { Component, EventEmitter, Inject, OnInit, Output, ViewChild } from '@angular/core';
import { IPurchasingItem } from '../../../../types/interfaces/procurement.interface';
import { PurchaseOrderService } from '../purchase-order.service';
import { AlertService } from '../../../../shared/components/alert/alert-service';
import { NgbActiveModal, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ColumnProps, GenericTable, ITableQueryData } from '../../../../shared/components/generic-table/generic-table';
import { ConfirmModal } from '../../../../shared/components/modals/confirm-modal/confirm-modal';
import { TableColumn } from '../../../../shared/directives/table-column/table-column';
import { SORT_DIR } from '../../../../types/constants/common.constants';
import { IPaginationInput, formType } from '../../../../types/interfaces/common.interface';
import { PurchaseOrderItemForm } from './purchase-order-item-form/purchase-order-item-form';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-purchase-order-item',
  imports: [GenericTable, TableColumn, ConfirmModal],
  templateUrl: './purchase-order-item.html',
  styleUrl: './purchase-order-item.scss'
})
export class PurchaseOrderItem implements OnInit {

  @Output() nextStep: EventEmitter<unknown> = new EventEmitter<unknown>()
  @Output() back: EventEmitter<unknown> = new EventEmitter<unknown>()

  @ViewChild('ConfirmModal') confrimModal?: ConfirmModal;

  isLoading: boolean = false;
  listPurchasingItem: IPurchasingItem[] = [];
  purchase_id: string | null = null;

  pagination: IPaginationInput = {
    page: 1,
    total: 100,
    size: 10,
    totalPages: 1
  };
  columns: Array<ColumnProps> = [
    {
      label: 'Product',
      id: 'product_name',
      extraHeaderClass: 'uppercase-text',
      backendPropName: 'product_name',
      sort: true,
    },
    {
      label: 'Supplier',
      id: 'supplier_name',
      extraHeaderClass: 'uppercase-text',
      backendPropName: 'supplier_name',
      sort: true,
    },
    {
      label: 'Purchase QTY',
      id: 'purchase_qty',
      extraHeaderClass: 'uppercase-text',
      backendPropName: 'purchase_qty',
    },
    {
      label: 'Purchase Price',
      id: 'purchase_price',
      extraHeaderClass: 'uppercase-text',
      backendPropName: 'purchase_price',
      dataType: 'CURRENCY'
    },
    {
      label: 'Sale Price',
      id: 'sell_price',
      extraHeaderClass: 'uppercase-text',
      backendPropName: 'sell_price',
      dataType: 'CURRENCY'
    },
    {
      label: 'Expired Date',
      id: 'exp_date',
      extraHeaderClass: 'uppercase-text',
      backendPropName: 'exp_date',
      dataType: 'DATE'
    },
    {
      label: 'Action',
      id: 'action',
      extraHeaderClass: 'uppercase-text w-100 d-flex justify-content-end',
      customElementId: 'action',
    }
  ]

  defaultTableParam = {
    page: this.pagination.page,
    size: this.pagination.size,
    sortBy: '',
    sortDir: SORT_DIR.ASC,
    search: '',
  }

  activeModal = Inject(NgbActiveModal);

  constructor(private service: PurchaseOrderService, private modalService: NgbModal, private alert: AlertService, private route: ActivatedRoute) {
    this.purchase_id = this.route.snapshot.paramMap.get('po_id') || null;
  }

  modalOptions: NgbModalOptions = {
    size: 'xl'
  }

  showForm(type: formType, id?: string) {
    const modalRef = this.modalService.open(PurchaseOrderItemForm, this.modalOptions);
    modalRef.componentInstance.type = type;
    modalRef.componentInstance.purchase_id = this.purchase_id;
    modalRef.componentInstance.purhcase_item_id = id;
    modalRef.componentInstance.close.subscribe((res) => {
      modalRef.dismiss();
      if (res) this.getList(this.defaultTableParam);
    })
  }

  getList(evt: ITableQueryData) {
    this.isLoading = true;
    this.service.getPurchasingItems(
      this.purchase_id || '',
      {
        page: evt.page,
        size: evt.size,
        sortBy: evt.sortBy,
        sortDir: evt.sortDir,
        search: evt.search,
      }).subscribe({
        next: (res) => {
          this.listPurchasingItem = res.list ?? [];
          this.pagination = {
            page: res.meta?.page ?? 0,
            total: res.meta?.total ?? 0,
            size: res.meta?.size ?? 0,
            totalPages: res.meta?.totalPages ?? 0
          }
          console.log({ listPurchasingItem: this.listPurchasingItem })
          this.isLoading = false;
        }, error: () => {
          this.isLoading = false;
        }
      });
  }

  ngOnInit(): void {
    this.getList(this.defaultTableParam);
  }

  deletePurchaseItem(purchaseItem: IPurchasingItem) {
    const purchaseItemId = purchaseItem._id;
    const itemName = `${purchaseItem.product_name}`;
    this.confrimModal?.show({ itemName }).then((res: any) => {
      if (res && purchaseItemId) {
        this.execDeleteion(purchaseItemId);
      }
    })
  }

  execDeleteion(purchaseItemId: string) {
    this.service.deletePurchaseItem(purchaseItemId).subscribe(() => {
      this.alert.success('Purchase item deleted')
      this.getList(this.defaultTableParam);
    });
  }
}


