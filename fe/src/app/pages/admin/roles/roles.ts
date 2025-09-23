import { Component, OnInit, Inject } from '@angular/core';
import { GenericTable, ITableQueryData } from '../../../shared/components/generic-table/generic-table';
import { TableColumn } from '../../../shared/directives/table-column/table-column';
import { IRole } from '../../../types/interfaces/user.interface';
import { IPaginationInput } from '../../../types/interfaces/common.interface';
import { RolesService } from './roles-service';
import { NgbActiveModal, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { RolesForm } from './roles-form/roles-form';

@Component({
  selector: 'app-roles',
  imports: [GenericTable, TableColumn],
  templateUrl: './roles.html',
  styleUrl: './roles.scss'
})
export class Roles implements OnInit {
  isLoading: boolean = false;
  listRoles: IRole[] = [];
  pagination: IPaginationInput = {
    page: 1,
    total: 100,
    size: 10,
    totalPages: 1
  };
  columns = [
    {
      label: 'Role Name',
      id: 'role_name',
      extraHeaderClass: 'uppercase-text',
    },
    {
      label: 'Action',
      id: 'action',
      extraHeaderClass: 'uppercase-text',
      customElementId: 'action',
    }
  ]

  activeModal = Inject(NgbActiveModal);

  constructor(private service: RolesService, private modalService: NgbModal) { }

  modalOptions: NgbModalOptions = {
    size: 'xl'
  }

  showForm() {
    const modalRef = this.modalService.open(RolesForm, this.modalOptions);
    modalRef.componentInstance.type = 'edit';
  }

  getList(evt: ITableQueryData) {
    this.isLoading = true;
    this.service.getRoles({
      page: evt.page,
      size: evt.size,
      sortBy: evt.sortBy,
      sortDir: evt.sortDir,
      search: evt.search,
    }).subscribe({
      next: (res) => {
        this.listRoles = res.list ?? [];
        this.pagination = {
          page: res.meta.page,
          total: res.meta.total,
          size: res.meta.size,
          totalPages: res.meta.totalPages
        }
        this.isLoading = false;
      }, error: () => {
        this.isLoading = false;
      }
    });
  }

  ngOnInit(): void {
    this.getList({
      page: this.pagination.page,
      size: this.pagination.size,
      search: '',
    })
  }
}
