import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { GenericTable, ITableQueryData } from '../../../shared/components/generic-table/generic-table';
import { IUser } from '../../../types/interfaces/user.interface';
import { UsersService } from './users-service';
import { TableColumn } from '../../../shared/directives/table-column/table-column';
import { IPaginationInput, ISelectFilter } from '../../../types/interfaces/common.interface';
import { SORT_DIR } from '../../../types/constants/common.constants';
import { NgbActiveModal, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { UserForm } from './user-form/user-form';
import { ConfirmModal } from '../../../shared/components/modals/confirm-modal/confirm-modal';
import { AlertService } from '../../../shared/components/alert/alert-service';

type formType = 'new' | 'edit' | 'view';
@Component({
  selector: 'app-users',
  imports: [GenericTable, TableColumn, ConfirmModal],
  templateUrl: './users.html',
  styleUrl: './users.scss'
})
export class Users implements OnInit {
  @ViewChild('ConfirmModal') confrimModal?: ConfirmModal;

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
      sort: true,
      minWidth: '4ch',
      maxWidth: '4ch'
    },
    {
      label: 'Role',
      id: 'role.role_name',
      extraHeaderClass: 'uppercase-text',
      minWidth: '5ch',
      maxWidth: '5ch'
    },
    {
      label: 'Email',
      id: 'email',
      extraHeaderClass: 'uppercase-text',
      minWidth: '5ch',
      maxWidth: '5ch'
    },
    {
      label: 'Status',
      id: 'verified',
      extraHeaderClass: 'uppercase-text',
      customElementId: 'status',
      minWidth: '3ch',
      maxWidth: '3ch'
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

  constructor(private service: UsersService, private modalService: NgbModal, private alert: AlertService) { }

  modalOptions: NgbModalOptions = {
    size: 'xl'
  }

  showForm(type: formType, id?: string) {
    const modalRef = this.modalService.open(UserForm, this.modalOptions);
    modalRef.componentInstance.type = type;
    modalRef.componentInstance.id = id;
    modalRef.componentInstance.close.subscribe((res) => {
      console.log({ res })
      modalRef.dismiss();
      if (res) this.getList(this.defaultTableParam);
    })
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
    this.getList(this.defaultTableParam);
  }

  deleteUser(user: IUser) {
    const user_id = user._id;
    const itemName = `${user.first_name} ${user.last_name}`;
    this.confrimModal?.show({ itemName }).then((res: any) => {
      if (res && user_id) {
        this.execDeleteion(user_id);
      }
    })
  }

  execDeleteion(role_id: string) {
    this.service.deleteUser(role_id).subscribe(() => {
      this.alert.success('User deleted')
      this.getList(this.defaultTableParam);
    });
  }

  resendVerification(role_id: string) {
    const customText = 'Do you want to re-send invitation email?'
    this.confrimModal?.show({ type: 'action', customText }).then((res: any) => {
      console.log({ res })
      if (res) {
        this.execResendVerification(role_id);
      }
    })
  }

  execResendVerification(role_id) {
    console.log('Resend Verification', role_id)
    this.service.resendInvitationEmail(role_id).subscribe((res) => {
      this.alert.success('Confirmation email sent')
    });
  }
}
