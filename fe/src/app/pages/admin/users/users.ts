import { Component, OnInit } from '@angular/core';
import { GenericTable, ITableQueryData, SortDirection } from '../../../shared/components/generic-table/generic-table';
import { IUser } from '../../../types/interfaces/user.interface';
import { UsersService } from './users-service';
import { TableColumn } from '../../../shared/directives/table-column/table-column';
import { IPaginationInput } from '../../../types/interfaces/common.interface';

@Component({
  selector: 'app-users',
  imports: [GenericTable, TableColumn],
  templateUrl: './users.html',
  styleUrl: './users.scss'
})
export class Users implements OnInit {
  listUser: IUser[] = [];
  pagination: IPaginationInput = {
    activePage: 1,
    totalData: 100,
    selectedSize: 10
  };
  columns = [
    {
      label: 'Name',
      id: 'first_name',
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
    this.service.getUsers().subscribe((val) => {
      console.log('val', val)
      this.listUser = val ?? [];
      this.pagination = {
        activePage: 1,
        totalData: 100,
        selectedSize: 10
      }
    });
  }

  ngOnInit(): void {
    this.getList({
      activePage: this.pagination.activePage,
      pageSize: this.pagination.selectedSize,
      sortBy: 'status', // column ID
      sortDirection: SortDirection.ASC,
      searchKeyword: '',
    })
  }
}
