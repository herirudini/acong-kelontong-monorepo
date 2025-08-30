import { Injectable } from '@angular/core';
import { BaseService } from '../rest-api/base-service';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Endpoint } from '../../types/constants/endpoint';
import { IUser } from '../../types/interfaces/user.interface';
import { Router } from '@angular/router';
import { AlertService } from '../../shared/components/alert/alert-service';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends BaseService {
  constructor(
    override http: HttpClient,
    private router: Router,
    private alert: AlertService
  ) {
    super(http);
  }

  signIn(userCreds: IUser): Observable<any> {
    return this.postRequest(Endpoint.SIGN_IN, userCreds).pipe(
      tap({
        next: (res: any) => {
          const token = res.access_token;
          const refreshToken = res.refresh_token;
          const profile: IUser = res.profile;
          if (profile?.is_email_verified && token) {
            // this.storeCurrentUser(profile);
            // this.storeToken(token);
            // this.storeRefreshToken(refreshToken!);
          }
        }
      })
    );
  }
  getProfile() {
    return {
      modules: [
        'dashboard.view',
        'dashboard.update',
        'dashboard.create',
        'dashboard-v1.view',
        'dashboard-v1.update',
        'dashboard-v1.create',
        'dashboard-v2.view',
        'dashboard-v3.view',
        'tables.view',
        'tables-simple.view',
        'forms.view',
        'forms-general.view',
      ],
    };
  }

  isAuthenticated() {
    return true;
    return !!localStorage.getItem('token');
  }

  isImmediateChangePassword() {
    return false;
    return localStorage.getItem('immediateChangePassword') === 'true';
  }
}
