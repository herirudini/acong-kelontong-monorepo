import { Injectable } from '@angular/core';
import { BaseService } from '../rest-api/base-service';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Endpoint } from '../../types/constants/endpoint';
import { IUser } from '../../types/interfaces/user.interface';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends BaseService {
  constructor(
    override http: HttpClient,
    private router: Router,
    // private toastService: ToastService
  ) {
    super(http);
  }

  signIn(userCreds: IUser): Observable<any> {
    return this.postRequest(Endpoint.SIGN_IN, userCreds).pipe(
      tap({
        next: (res: any) => {
          const token  = res.access_token;
          const refreshToken  = res.refresh_token;
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
        { module_code: 'dashboard.view' },
        { module_code: 'dashboard.update' },
        { module_code: 'dashboard.create' },
        { module_code: 'dashboard-v1.view' },
        { module_code: 'dashboard-v1.update' },
        { module_code: 'dashboard-v1.create' },
        { module_code: 'dashboard-v2.view' },
        { module_code: 'dashboard-v3.view' },
        { module_code: 'tables.view' },
        { module_code: 'tables-simple.view' },
        { module_code: 'forms.view' },
        { module_code: 'forms-general.view' },
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
