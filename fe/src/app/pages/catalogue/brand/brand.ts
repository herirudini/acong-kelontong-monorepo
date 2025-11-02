import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { GenericTable, ITableQueryData } from '../../../shared/components/generic-table/generic-table';
import { TableColumn } from '../../../shared/directives/table-column/table-column';
import { formType, IPaginationInput, ISelectFilter } from '../../../types/interfaces/common.interface';
import { SORT_DIR } from '../../../types/constants/common.constants';
import { NgbActiveModal, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmModal } from '../../../shared/components/modals/confirm-modal/confirm-modal';
import { AlertService } from '../../../shared/components/alert/alert-service';
import { BrandService } from './brand-service';
import { BrandForm } from './brand-form/brand-form';
import { IBrand } from '../../../types/interfaces/catalogue.interface';

@Component({
  selector: 'app-brand',
  imports: [GenericTable, TableColumn, ConfirmModal],
  templateUrl: './brand.html',
  styleUrl: './brand.scss'
})
export class Brand implements OnInit {
  @ViewChild('ConfirmModal') confrimModal?: ConfirmModal;

  isLoading: boolean = false;
  listBrand: IBrand[] = [];
  
  pagination: IPaginationInput = {
    page: 1,
    total: 100,
    size: 10,
    totalPages: 1
  };
  columns = [
    {
      label: 'Name',
      id: 'brand_name',
      extraHeaderClass: 'uppercase-text',
      backendPropName: 'brand_name',
      sort: true,
      minWidth: '4ch',
      maxWidth: '4ch'
    },
    {
      label: 'Description',
      id: 'brand_description',
      extraHeaderClass: 'uppercase-text',
      backendPropName: 'brand_description',
      maxWidth: '7ch'
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

  constructor(private service: BrandService, private modalService: NgbModal, private alert: AlertService) { }

  modalOptions: NgbModalOptions = {
    size: 'xl'
  }

  showForm(type: formType, id?: string) {
    const modalRef = this.modalService.open(BrandForm, this.modalOptions);
    modalRef.componentInstance.type = type;
    modalRef.componentInstance.id = id;
    modalRef.componentInstance.close.subscribe((res) => {
      modalRef.dismiss();
      if (res) this.getList(this.defaultTableParam);
    })
  }

  getList(evt: ITableQueryData) {
    this.isLoading = true;
    this.service.getBrands({
      page: evt.page,
      size: evt.size,
      sortBy: evt.sortBy,
      sortDir: evt.sortDir,
      search: evt.search,
    }).subscribe({
      next: (res) => {
        this.listBrand = res.list ?? [];
        this.pagination = {
          page: res.meta?.page ?? 0,
          total: res.meta?.total ?? 0,
          size: res.meta?.size ?? 0,
          totalPages: res.meta?.totalPages ?? 0
        }
        console.log({listBrand: this.listBrand})
        this.isLoading = false;
      }, error: () => {
        this.isLoading = false;
      }
    });
  }

  ngOnInit(): void {
    this.getList(this.defaultTableParam);
  }

  deleteBrand(brand: IBrand) {
    const brand_id = brand._id;
    const itemName = `${brand.brand_name}`;
    this.confrimModal?.show({ itemName }).then((res: any) => {
      if (res && brand_id) {
        this.execDeleteion(brand_id);
      }
    })
  }

  execDeleteion(role_id: string) {
    this.service.deleteBrand(role_id).subscribe(() => {
      this.alert.success('Brand deleted')
      this.getList(this.defaultTableParam);
    });
  }
}
