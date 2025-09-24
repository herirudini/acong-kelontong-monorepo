import { Injectable } from '@angular/core';
import { BaseService } from '../rest-api/base-service';
import { Observable, tap } from 'rxjs';
import { Endpoint } from '../../types/constants/endpoint';
import { IUser } from '../../types/interfaces/user.interface';
import { Router } from '@angular/router';
import { AlertService } from '../../shared/components/alert/alert-service';
import { IAuth, TLogoutOption } from '../../types/interfaces/common.interface';
import { StorageService } from '../tools/storage-service';

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

  login(userCreds: { email: string, password: string }) {
    this.postRequest(Endpoint.LOGIN, userCreds).pipe(
      tap((res: { detail: IAuth }) => {
        try {
          const token = res.detail.access_token;
          const profile: IUser = res.detail.profile;
          if (token) {
            this.setProfile(profile);
            this.setAccessToken(token);
          }
        } catch (err) {
          console.error({ err })
        }
      })
    ).subscribe(() => {
      this.router.navigateByUrl("/").then(() => {
        window.location.reload();  // TODO: this is temporary solution to handle src/assets/admin-lte/ source not loaded (late)
      });
      this.alert.success("Logged in succesfully!");
    });
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

  logout(option?: TLogoutOption) {
    this.storage.clear();
    this.router.navigateByUrl('/login').then(() => {
      this.postRequest(Endpoint.LOGOUT, {}, { option }).subscribe();
    });
  }

  isImmediateChangePassword() {
    return false;
  }
}
