import { Injectable } from '@angular/core';
import { BaseService } from '../rest-api/base-service';
import { Observable, tap } from 'rxjs';
import { Endpoint } from '../../types/constants/endpoint';
import { IUser, TModules } from '../../types/interfaces/user.interface';
import { Router } from '@angular/router';
import { AlertService } from '../../shared/components/alert/alert-service';
import { IAuth, TLogoutOption } from '../../types/interfaces/common.interface';
import { StorageService } from '../tools/storage-service';

const dummyModules: TModules[] = [ // TODO: remove this dummy later
  'dashboard.view',
  'dashboard.edit',
  'dashboard.create',
  'dashboard-v1.view',
  'dashboard-v1.edit',
  'dashboard-v1.create',
  'dashboard-v2.view',
  'dashboard-v3.view',
  'tables.view',
  'tables-simple.view',
  'forms.view',
  'forms-general.view',
]

@Injectable({
  providedIn: 'root'
})
export class AuthService extends BaseService {

  constructor(
    private router: Router,
    private alert: AlertService,
    private storage: StorageService,
  ) {
    super();
  }

  /** ✅ Auth check works in SSR and browser */
  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  setAccessToken(token: string) {
    return this.storage.setItem('access_token', token);
  }

  getAccessToken(): string | undefined {
    return this.storage.getItem('access_token');
  }

  clearAccessToken() {
    this.storage.removeItem('access_token');
  }

  setProfile(profile: IUser) {
    this.storage.setItem('profile', profile);
  }

  getProfile(): IUser | undefined {
    return this.storage.getItem('profile');
  }

  login(userCreds: { email: string, password: string }): Observable<any> {
    return this.postRequest(Endpoint.LOGIN, userCreds).pipe(
      tap((res: { detail: IAuth }) => {
        const token = res.detail.access_token;
        const profile: IUser = res.detail.profile;
        profile.role.modules = profile.role.modules.concat(dummyModules)
        if (token) {
          this.setProfile(profile);
          this.setAccessToken(token);
        }
      })
    );
  }

  refreshToken(): Observable<{ detail: IAuth }> {
    return this.postRequest(Endpoint.REFRESH).pipe(
      tap((res: { detail: IAuth }) => {
        const token = res.detail.access_token;
        if (token) {
          this.setAccessToken(token);
        }
      })
    );
  }

  logout(option?: TLogoutOption): Observable<any> {
    return this.postRequest(Endpoint.LOGOUT, {}, { option }).pipe(
      tap({
        next: () => {
          this.storage.clear();
          this.router.parseUrl('/login');
        },
        error: (err) => {
          console.error('the errorr', err)
        }
      })
    );
  }

  isImmediateChangePassword() {
    return false;
  }
}
