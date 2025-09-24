import { Injectable } from '@angular/core';
import { BaseService } from '../../../services/rest-api/base-service';
import { AlertService } from '../../../shared/components/alert/alert-service';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { IRole, IUser, TModules } from '../../../types/interfaces/user.interface';
import { Endpoint } from '../../../types/constants/endpoint';
import {
  IPaginationInput,
  IPaginationOutput,
  IResponse,
  ISort,
} from '../../../types/interfaces/common.interface';

interface IParamsUser extends IPaginationOutput, ISort {
  search?: string;
  verified?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class UsersService extends BaseService {
  constructor(private alert: AlertService) {
    super();
  }

  getUsers(
    params: IParamsUser
  ): Observable<{ list: IUser[]; meta: IPaginationInput }> {
    return this.getRequest(Endpoint.USERS, params, 'spinneroff').pipe(
      map((res: IResponse<IUser>) => {
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

  getRoles(): Observable<IRole[]> {
    return this.getRequest(Endpoint.ROLES, undefined, 'spinneroff').pipe(
      map((res: IResponse<IRole[]>) => {
        return res.list;
      }),
      catchError((err) => {
        console.error(err);
        this.alert.error('Cannot get list role');
        return of(undefined); // emit undefined so the stream completes gracefully
      })
    ) as any;
  }
}
