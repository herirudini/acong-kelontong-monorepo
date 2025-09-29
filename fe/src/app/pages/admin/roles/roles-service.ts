import { Injectable } from '@angular/core';
import { Observable, map, catchError, of } from 'rxjs';
import { Endpoint } from '../../../types/constants/endpoint';
import { IRole, TModules } from '../../../types/interfaces/user.interface';
import { BaseService } from '../../../services/rest-api/base-service';
import { AlertService } from '../../../shared/components/alert/alert-service';
import { IResDetail, IResList } from '../../../types/interfaces/http.interface';
import { ITableQueryData } from '../../../shared/components/generic-table/generic-table';

@Injectable({
  providedIn: 'root'
})
export class RolesService extends BaseService {
  constructor(private alert: AlertService) {
    super();
  }


  getRoles(
    qParams: ITableQueryData
  ): Observable<IResList<IRole>> {
    return this.getRequest({ url: Endpoint.ROLES, qParams, spinner: false }).pipe(
      map((res: IResList<IRole>) => {
        return res;
      }),
      catchError((err) => {
        console.error(err);
        this.alert.error('Cannot get list role');
        return of(undefined); // emit undefined so the stream completes gracefully
      })
    ) as any;
  }

  getRole( id: string): Observable<IRole> {
    return this.getRequest({ url: Endpoint.ROLES_ID(id) }).pipe(
      map((res: IResDetail<IRole>) => {
        return res.detail;
      }),
      catchError((err) => {
        console.error(err);
        this.alert.error('Cannot get role');
        return of(undefined); // emit undefined so the stream completes gracefully
      })
    ) as any;
  }

  createRole(
    body: IRole
  ): Observable<IRole> {
    return this.postRequest({ url: Endpoint.ROLES, body }).pipe(
      map((res: IResDetail<IRole>) => {
        return res.detail;
      }),
      catchError((err) => {
        console.error(err);
        this.alert.error('Cannot create role');
        return of(undefined); // emit undefined so the stream completes gracefully
      })
    ) as any;
  }

  editRole(
    id: string,
    body: IRole
  ): Observable<IRole> {
    return this.putRequest({ url: Endpoint.ROLES_ID(id), body }).pipe(
      map((res: IResDetail<IRole>) => {
        return res.detail;
      }),
      catchError((err) => {
        console.error(err);
        this.alert.error('Cannot create role');
        return of(undefined); // emit undefined so the stream completes gracefully
      })
    ) as any;
  }

  getModules(): Observable<TModules[]> {
    return this.getRequest({ url: Endpoint.PERMISSIONS }).pipe(
      map((res: IResDetail<TModules[]>) => {
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
