import { Injectable } from '@angular/core';
import { BaseService } from '../../../services/rest-api/base-service';
import { AlertService } from '../../../shared/components/alert/alert-service';
import { catchError, map, Observable, of } from 'rxjs';
import { IRole, IUser } from '../../../types/interfaces/user.interface';
import { Endpoint } from '../../../types/constants/endpoint';
import { IPaginationInput } from '../../../types/interfaces/common.interface';
import { IResDetail, IResList } from '../../../types/interfaces/http.interface';
import { ITableQueryData } from '../../../shared/components/generic-table/generic-table';
import { RolesService } from '../roles/roles-service';

interface IParamsUser extends ITableQueryData {
  verified?: boolean;
}

interface IBodyInviteUser {
  first_name: string;
  last_name: string;
  email: string;
  role: string; // role._id
}

@Injectable({
  providedIn: 'root',
})
export class UsersService extends BaseService {
  constructor(private alert: AlertService, private roleService: RolesService) {
    super();
  }

  getUsers(
    qParams: IParamsUser
  ): Observable<IResList<IUser>> {
    return this.getRequest({ url: Endpoint.USERS, qParams, spinner: false }).pipe(
      map((res: IResList<IUser>) => {
        const val = {
          meta: res?.meta as IPaginationInput,
          list: res?.list?.map((item) => {
            return {
              ...item,
              name: `${item.first_name} ${item.last_name}`,
              status: item.verified ? 'Verified' : 'Unverified',
            };
          }) as IUser[],
        };
        return val;
      }),
      catchError((err) => {
        console.error(err);
        this.alert.error('Cannot get list user');
        return of(undefined); // emit undefined so the stream completes gracefully
      })
    ) as any;
  }

  inviteUser(
    body: IBodyInviteUser
  ): Observable<IUser> {
    return this.postRequest({ url: Endpoint.USERS, body }).pipe(
      map((res: IResDetail<IUser>) => {
        return res.detail;
      }),
      catchError((err) => {
        console.error(err);
        this.alert.error('Cannot invite user');
        return of(undefined); // emit undefined so the stream completes gracefully
      })
    ) as any;
  }

  resendInvitationEmail(user_id: string): Observable<IUser> {
    return this.postRequest({ url: Endpoint.USERS_ID_REINVITE(user_id) }).pipe(
      map((res: IResDetail<IUser>) => {
        return res.detail;
      }),
      catchError((err) => {
        console.error(err);
        this.alert.error('Cannot invite user');
        return of(undefined); // emit undefined so the stream completes gracefully
      })
    ) as any;
  }

  editUserRole(
    user_id: string,
    body: { role: string }
  ): Observable<IUser> {
    return this.putRequest({ url: Endpoint.USERS_ID_ROLE(user_id), body }).pipe(
      map((res: IResDetail<IUser>) => {
        return res.detail;
      }),
      catchError((err) => {
        console.error(err);
        this.alert.error('Cannot edit user');
        return of(undefined); // emit undefined so the stream completes gracefully
      })
    ) as any;
  }

  getUserDetail(user_id: string): Observable<IUser> {
    return this.getRequest({ url: Endpoint.USERS_ID(user_id) }).pipe(
      map((res: IResDetail<IUser>) => {
        return res.detail;
      }),
      catchError((err) => {
        console.error(err);
        this.alert.error('Cannot get user detail');
        return of(undefined); // emit undefined so the stream completes gracefully
      })
    ) as any;
  }

  deleteUser(user_id: string): Observable<IUser> {
    return this.deleteRequest({ url: Endpoint.USERS_ID(user_id) }).pipe(
      map((res: IResDetail<IUser>) => {
        return res.detail;
      }),
      catchError((err) => {
        console.error(err);
        this.alert.error('Cannot delete user');
        return of(undefined); // emit undefined so the stream completes gracefully
      })
    ) as any;
  }

  getRoles(qParams: ITableQueryData): Observable<IResList<IRole>> {
    return this.roleService.getRoles(qParams);
  }
}
