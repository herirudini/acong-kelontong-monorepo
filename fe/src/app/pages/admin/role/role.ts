import { Component, OnInit, ViewChild } from '@angular/core';
import { GenericTable, ITableQueryData } from '../../../shared/components/generic-table/generic-table';
import { TableColumn } from '../../../shared/directives/table-column/table-column';
import { IRole } from '../../../types/interfaces/user.interface';
import { IPaginationInput } from '../../../types/interfaces/common.interface';
import { RoleService } from './role-service';
import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { RouterLink } from '@angular/router';
import { ConfirmModal } from '../../../shared/components/modals/confirm-modal/confirm-modal';

@Component({
  selector: 'app-role',
  imports: [GenericTable, TableColumn, RouterLink, ConfirmModal],
  templateUrl: './role.html',
  styleUrl: './role.scss'
})
export class Role implements OnInit {
  @ViewChild('DeleteModal') confrimDelete?: ConfirmModal;
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
      minWidth: '2ch',
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
  defaultQuery = {
    page: this.pagination.page,
    size: this.pagination.size,
    search: '',
  }

  constructor(private service: RoleService) { }

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

  deleteRole(role_id: string) {
    this.confrimDelete?.show().then((res: any) => {
      if (res) {
        this.execDeleteion(role_id);
      }
    })
  }

  execDeleteion(role_id: string) {
    this.service.deleteRole(role_id).subscribe(()=>{
      this.getList(this.defaultQuery);
    });
  }
}
