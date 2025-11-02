import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { GenericTable, ITableQueryData } from '../../../shared/components/generic-table/generic-table';
import { TableColumn } from '../../../shared/directives/table-column/table-column';
import { formType, IPaginationInput, ISelectFilter } from '../../../types/interfaces/common.interface';
import { SORT_DIR } from '../../../types/constants/common.constants';
import { NgbActiveModal, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmModal } from '../../../shared/components/modals/confirm-modal/confirm-modal';
import { AlertService } from '../../../shared/components/alert/alert-service';
import { SupplierForm } from './supplier-form/supplier-form';
import { ISupplier } from '../../../types/interfaces/procurement.interface';
import { SupplierService } from './supplier.service';

@Component({
  selector: 'app-supplier',
  imports: [GenericTable, TableColumn, ConfirmModal],
  templateUrl: './supplier.html',
  styleUrl: './supplier.scss'
})
export class Supplier implements OnInit {
  @ViewChild('ConfirmModal') confrimModal?: ConfirmModal;

  isLoading: boolean = false;
  listSupplier: ISupplier[] = [];
  
  pagination: IPaginationInput = {
    page: 1,
    total: 100,
    size: 10,
    totalPages: 1
  };
  columns = [
    {
      label: 'Name',
      id: 'supplier_name',
      extraHeaderClass: 'uppercase-text',
      backendPropName: 'supplier_name',
      sort: true,
      minWidth: '4ch',
      maxWidth: '4ch'
    },
    {
      label: 'Phone',
      id: 'supplier_phone',
      extraHeaderClass: 'uppercase-text',
      backendPropName: 'supplier_phone',
      maxWidth: '4ch'
    },
    {
      label: 'Email',
      id: 'supplier_email',
      extraHeaderClass: 'uppercase-text',
      backendPropName: 'supplier_email',
      maxWidth: '4ch'
    },
    {
      label: 'Address',
      id: 'supplier_address',
      extraHeaderClass: 'uppercase-text',
      backendPropName: 'supplier_address',
      maxWidth: '4ch'
    },
    {
      label: 'Action',
      id: 'action',
      extraHeaderClass: 'uppercase-text w-100 d-flex justify-content-end',
      customElementId: 'action',
      minWidth: '3ch',
      maxWidth: '3ch'
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

  constructor(private service: SupplierService, private modalService: NgbModal, private alert: AlertService) { }

  modalOptions: NgbModalOptions = {
    size: 'xl'
  }

  showForm(type: formType, id?: string) {
    const modalRef = this.modalService.open(SupplierForm, this.modalOptions);
    modalRef.componentInstance.type = type;
    modalRef.componentInstance.id = id;
    modalRef.componentInstance.close.subscribe((res) => {
      modalRef.dismiss();
      if (res) this.getList(this.defaultTableParam);
    })
  }

  getList(evt: ITableQueryData) {
    this.isLoading = true;
    this.service.getSuppliers({
      page: evt.page,
      size: evt.size,
      sortBy: evt.sortBy,
      sortDir: evt.sortDir,
      search: evt.search,
    }).subscribe({
      next: (res) => {
        this.listSupplier = res.list ?? [];
        this.pagination = {
          page: res.meta?.page ?? 0,
          total: res.meta?.total ?? 0,
          size: res.meta?.size ?? 0,
          totalPages: res.meta?.totalPages ?? 0
        }
        console.log({listSupplier: this.listSupplier})
        this.isLoading = false;
      }, error: () => {
        this.isLoading = false;
      }
    });
  }

  ngOnInit(): void {
    this.getList(this.defaultTableParam);
  }

  deleteSupplier(supplier: ISupplier) {
    const supplier_id = supplier._id;
    const itemName = `${supplier.supplier_name}`;
    this.confrimModal?.show({ itemName }).then((res: any) => {
      if (res && supplier_id) {
        this.execDeleteion(supplier_id);
      }
    })
  }

  execDeleteion(role_id: string) {
    this.service.deleteSupplier(role_id).subscribe(() => {
      this.alert.success('Supplier deleted')
      this.getList(this.defaultTableParam);
    });
  }
}

