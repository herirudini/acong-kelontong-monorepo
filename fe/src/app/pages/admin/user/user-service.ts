import { Injectable } from '@angular/core';
import { BaseService } from '../../../services/rest-api/base-service';
import { AlertService } from '../../../shared/components/alert/alert-service';
import { catchError, map, Observable, of } from 'rxjs';
import { IRole, IUser } from '../../../types/interfaces/user.interface';
import { Endpoint } from '../../../types/constants/endpoint';
import { IPaginationInput } from '../../../types/interfaces/common.interface';
import { IResDetail, IResList } from '../../../types/interfaces/http.interface';
import { ITableQueryData } from '../../../shared/components/generic-table/generic-table';
import { RoleService } from '../role/role-service';

interface IParamsUser extends ITableQueryData {
  verified?: boolean;
}

interface IBodyInviteUser {
  first_name: string;
  last_name: string;
  email: string;
  role: string; // role._id
}

interface IGetRoles extends ITableQueryData {
  active?: boolean
}

@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseService {
  constructor(private alert: AlertService, private roleService: RoleService) {
    super();
  }

  getUsers(
    qParams: IParamsUser
  ): Observable<IResList<IUser>> {
    return this.getRequest({ url: Endpoint.USER, qParams, spinner: false }).pipe(
      map((res: IResList<IUser>) => {
        const val = {
          meta: res?.meta as IPaginationInput,
          list: res?.list?.map((item) => {
            return {
              ...item,
              name: `${item.first_name} ${item.last_name}`,
            };
          }) as IUser[],
        };
        return val;
      }),
      catchError((err) => {
        console.error(err);
        this.alert.error('Cannot get list user');
        throw new Error(err);
      })
    ) as any;
  }

  inviteUser(
    body: IBodyInviteUser
  ): Observable<IUser> {
    return this.postRequest({ url: Endpoint.USER, body }).pipe(
      map((res: IResDetail<IUser>) => {
        return res.detail;
      }),
      catchError((err) => {
        console.error(err);
        this.alert.error('Cannot invite user');
        throw new Error(err);
      })
    ) as any;
  }

  resendInvitationEmail(user_id: string): Observable<IUser> {
    return this.postRequest({ url: Endpoint.USER_ID_REINVITE(user_id) }).pipe(
      map((res: IResDetail<IUser>) => {
        return res.detail;
      }),
      catchError((err) => {
        console.error(err);
        this.alert.error('Cannot invite user');
        throw new Error(err);
      })
    ) as any;
  }

  editUserRole(
    user_id: string,
    body: { role: string }
  ): Observable<IUser> {
    return this.putRequest({ url: Endpoint.USER_ID_ROLE(user_id), body }).pipe(
      map((res: IResDetail<IUser>) => {
        return res.detail;
      }),
      catchError((err) => {
        console.error(err);
        this.alert.error('Cannot edit user');
        throw new Error(err);
      })
    ) as any;
  }

  getUserDetail(user_id: string): Observable<IUser> {
    return this.getRequest({ url: Endpoint.USER_ID(user_id) }).pipe(
      map((res: IResDetail<IUser>) => {
        return res.detail;
      }),
      catchError((err) => {
        console.error(err);
        this.alert.error('Cannot get user detail');
        throw new Error(err);
      })
    ) as any;
  }

  deleteUser(user_id: string): Observable<IUser> {
    return this.deleteRequest({ url: Endpoint.USER_ID(user_id) }).pipe(
      map((res: IResDetail<IUser>) => {
        return res.detail;
      }),
      catchError((err) => {
        console.error(err);
        this.alert.error('Cannot delete user');
        throw new Error(err);
      })
    ) as any;
  }

  verifyUser(body: { ticket: string, new_password }): Observable<IUser> {
    return this.putRequest({ url: Endpoint.USER_VERIFY, body });
  }

  getRoles(qParams: IGetRoles): Observable<IResList<IRole>> {
    return this.roleService.getRoles(qParams);
  }
}
