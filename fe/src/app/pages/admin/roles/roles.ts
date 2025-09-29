import { Component, OnInit } from '@angular/core';
import { GenericTable, ITableQueryData } from '../../../shared/components/generic-table/generic-table';
import { TableColumn } from '../../../shared/directives/table-column/table-column';
import { IRole } from '../../../types/interfaces/user.interface';
import { IPaginationInput } from '../../../types/interfaces/common.interface';
import { RolesService } from './roles-service';
import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-roles',
  imports: [GenericTable, TableColumn, RouterLink],
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
      minWidth: '4ch',
      maxWidth: '4ch'

    }
  ]
  defaultQuery = {
    page: this.pagination.page,
    size: this.pagination.size,
    search: '',
  }

  constructor(private service: RolesService) { }

  modalOptions: NgbModalOptions = {
    size: 'xl'
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
    this.getList(this.defaultQuery)
  }
}
