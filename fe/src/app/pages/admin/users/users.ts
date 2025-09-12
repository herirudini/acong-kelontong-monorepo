import { Component, OnInit } from '@angular/core';
import { GenericTable, ITableQueryData } from '../../../shared/components/generic-table/generic-table';
import { IUser } from '../../../types/interfaces/user.interface';
import { UsersService } from './users-service';
import { TableColumn } from '../../../shared/directives/table-column/table-column';
import { IPaginationInput } from '../../../types/interfaces/common.interface';
import { SORT_DIR } from '../../../types/constants/common.constants';

@Component({
  selector: 'app-users',
  imports: [GenericTable, TableColumn],
  templateUrl: './users.html',
  styleUrl: './users.scss'
})
export class Users implements OnInit {
  listUser: IUser[] = [];
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
      sort: true
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
    this.service.getUsers({
      page: evt.page,
      size: evt.size,
      sortBy:evt.sortBy,
      sortDir:evt.sortDir,
      search:evt.search,
      verified: undefined
    }).subscribe((res) => {
      console.log('val', {res})
      this.listUser = res.list ?? [];
      this.pagination = {
        page: res.meta.page,
        total: res.meta.total,
        size: res.meta.size,
        totalPages: res.meta.totalPages
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
