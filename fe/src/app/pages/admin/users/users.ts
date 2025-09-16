import { Component, OnInit } from '@angular/core';
import { GenericTable, ITableQueryData } from '../../../shared/components/generic-table/generic-table';
import { IUser } from '../../../types/interfaces/user.interface';
import { UsersService } from './users-service';
import { TableColumn } from '../../../shared/directives/table-column/table-column';
import { IPaginationInput, ISelectFilter } from '../../../types/interfaces/common.interface';
import { SORT_DIR } from '../../../types/constants/common.constants';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-users',
  imports: [GenericTable, TableColumn, RouterLink],
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
      id: 'role',
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

  constructor(private service: UsersService) { }

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
      sortBy: 'status', // column ID
      sortDir: SORT_DIR.ASC,
      search: '',
    })
  }
}
