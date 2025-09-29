import { Component, Inject, OnInit } from '@angular/core';
import { GenericTable, ITableQueryData } from '../../../shared/components/generic-table/generic-table';
import { IUser } from '../../../types/interfaces/user.interface';
import { UsersService } from './users-service';
import { TableColumn } from '../../../shared/directives/table-column/table-column';
import { IPaginationInput, ISelectFilter } from '../../../types/interfaces/common.interface';
import { SORT_DIR } from '../../../types/constants/common.constants';
import { NgbActiveModal, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { UserForm } from './user-form/user-form';

@Component({
  selector: 'app-users',
  imports: [GenericTable, TableColumn],
  templateUrl: './users.html',
  styleUrl: './users.scss'
})
export class Users implements OnInit {
  isLoading: boolean = false;
  listUser: IUser[] = [];
  filterSelect: ISelectFilter = {
    title: 'Filter status',
    selectOptions: [
      {
        label: 'Verified',
        value: true
      },
      {
        label: 'Unverified',
        value: false
      }
    ]
  }
  pagination: IPaginationInput = {
    page: 1,
    total: 100,
    size: 10,
    totalPages: 1
  };
  columns = [
    {
      label: 'Name',
      id: 'name',
      extraHeaderClass: 'uppercase-text',
      backendPropName: 'first_name',
      sort: true
    },
    {
      label: 'Role',
      id: 'role.role_name',
      extraHeaderClass: 'uppercase-text',
    },
    {
      label: 'Email',
      id: 'email',
      extraHeaderClass: 'uppercase-text',
    },
    {
      label: 'Status',
      id: 'status',
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

  constructor(private service: UsersService, private modalService: NgbModal) { }

  modalOptions: NgbModalOptions = {
    size: 'xl'
  }

  showForm() {
    const modalRef = this.modalService.open(UserForm, this.modalOptions);
    modalRef.componentInstance.type = 'edit';
  }

  getList(evt: ITableQueryData) {
    this.isLoading = true;
    this.service.getUsers({
      page: evt.page,
      size: evt.size,
      sortBy: evt.sortBy,
      sortDir: evt.sortDir,
      search: evt.search,
      verified: evt.filterSelectVal?.value
    }).subscribe({
      next: (res) => {
        this.listUser = res.list ?? [];
        this.pagination = {
          page: res.meta?.page ?? 0,
          total: res.meta?.total ?? 0,
          size: res.meta?.size ?? 0,
          totalPages: res.meta?.totalPages ?? 0
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
      sortBy: 'status', // column ID
      sortDir: SORT_DIR.ASC,
      search: '',
    })
  }
}
