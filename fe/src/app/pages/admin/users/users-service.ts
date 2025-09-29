import { Injectable } from '@angular/core';
import { BaseService } from '../../../services/rest-api/base-service';
import { AlertService } from '../../../shared/components/alert/alert-service';
import { catchError, map, Observable, of } from 'rxjs';
import { IRole, IUser } from '../../../types/interfaces/user.interface';
import { Endpoint } from '../../../types/constants/endpoint';
import { IPaginationInput } from '../../../types/interfaces/common.interface';
import { IResList } from '../../../types/interfaces/http.interface';
import { ITableQueryData } from '../../../shared/components/generic-table/generic-table';
import { RolesService } from '../roles/roles-service';

interface IParamsUser extends ITableQueryData {
  verified?: boolean;
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

  getRoles(qParams: ITableQueryData): Observable<IResList<IRole>> {
    return this.roleService.getRoles(qParams);
  }
}
