import { Injectable } from '@angular/core';
import { Observable, map, catchError, of } from 'rxjs';
import { Endpoint } from '../../../types/constants/endpoint';
import { IPaginationInput, IPaginationOutput, IResponse, ISort } from '../../../types/interfaces/common.interface';
import { IRole, TModules } from '../../../types/interfaces/user.interface';
import { BaseService } from '../../../services/rest-api/base-service';
import { AlertService } from '../../../shared/components/alert/alert-service';

interface IParamsRoles extends IPaginationOutput, ISort {
  search?: string;
}

@Injectable({
  providedIn: 'root'
})
export class RolesService extends BaseService {
  constructor(private alert: AlertService) {
    super();
  }


  getRoles(
    params: IParamsRoles
  ): Observable<{ list: IRole[]; meta: IPaginationInput }> {
    return this.getRequest(Endpoint.ROLES, params, 'spinneroff').pipe(
      map((res: IResponse<IRole>) => {
        const val = {
          ...res
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

   getPermissions(): Observable<TModules[]> {
    return this.getRequest(Endpoint.PERMISSIONS, undefined, 'spinneroff').pipe(
      map((res: IResponse<TModules[]>) => {
        return res.detail;
      }),
      catchError((err) => {
        console.error(err);
        this.alert.error('Cannot get list permission');
        return of(undefined); // emit undefined so the stream completes gracefully
      })
    ) as any;
  }
}
