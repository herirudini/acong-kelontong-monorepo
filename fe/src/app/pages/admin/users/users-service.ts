import { Injectable } from '@angular/core';
import { BaseService } from '../../../services/rest-api/base-service';
import { AlertService } from '../../../shared/components/alert/alert-service';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { IUser } from '../../../types/interfaces/user.interface';
import { Endpoint } from '../../../types/constants/endpoint';
import { IResponse } from '../../../types/interfaces/common.interface';

@Injectable({
  providedIn: 'root'
})
export class UsersService extends BaseService {

  constructor(
    private alert: AlertService,
  ) {
    super();
  }

  getUsers(): Observable<IUser[] | undefined> {
    return this.getRequest(Endpoint.USERS).pipe(
      map((res: IResponse<IUser>) => {
        console.log('getUsers', { res, list: res.list })
        return res.list?.map(item => {
          return {
            ...item,
            status: item.verified ? 'Verified' : 'Unverified'
          }
        });
      }),   // transform response
      catchError((err) => {
        console.error(err);
        this.alert.error('Cannot get list user');
        return of(undefined);  // emit undefined so the stream completes gracefully
      })
    );
  }

}
