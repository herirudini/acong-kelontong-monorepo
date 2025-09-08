import { Injectable } from '@angular/core';
import { BaseService } from '../rest-api/base-service';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Endpoint } from '../../types/constants/endpoint';
import { IUser } from '../../types/interfaces/user.interface';
import { Router } from '@angular/router';
import { AlertService } from '../../shared/components/alert/alert-service';
import { IAuth } from '../../types/interfaces/common.interface';
import { sessionMinutes } from '../../types/constants/common.constants';
import { SessionStorageService } from '../tools/session-storage-service';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends BaseService {
  private refreshIntervalId: any = null;

  constructor(
    override http: HttpClient,
    private router: Router,
    private alert: AlertService,
    private session: SessionStorageService,
    private cookies: CookieService,
  ) {
    super(http);
  }

  
  /** ✅ Auth check works in SSR and browser */
  isAuthenticated(): boolean {
    const token = this.getAccessToken();
    return !!token;
  }

  setAccessToken(token: string) {
    // Store in cookie so both SSR and browser can read it
    // httpOnly cookie is better if set by backend
    this.cookies.set('access_token', token, {
      path: '/',
      secure: environment.production, // set true if https
      sameSite: 'Lax',
    });
  }

  getAccessToken(): string | null {
    const token = this.cookies.get('access_token');
    return token || null;
  }

  clearAccessToken() {
    this.cookies.delete('access_token', '/');
  }

  setProfile(profile: IUser) {
    this.session.setItem('profile', profile);
  }

  login(userCreds: { email: string, password: string }): Observable<any> {
    return this.postRequest(Endpoint.LOGIN, userCreds).pipe(
      tap((res: IAuth) => {
        const token = res.access_token;
        const profile: IUser = res.profile;
        if (token) {
          this.setProfile(profile);
          this.setAccessToken(token);
          this.startRefresh()
        }
      })
    );
  }

  /** 🔄 Setup periodic refresh */
  private startRefresh() {
    this.stopRefresh(); // clear old interval first
    this.refreshIntervalId = setInterval(() => {
      this.refreshToken().subscribe(); // subscribe so request runs
    }, (sessionMinutes - 1) * 60 * 1000); // reduce one minutes to be safe
  }
  private stopRefresh() {
    if (this.refreshIntervalId) {
      clearInterval(this.refreshIntervalId);
      this.refreshIntervalId = null;
    }
  }

  refreshToken(): Observable<IAuth> {
    return this.postRequest(Endpoint.REFRESH).pipe(
      tap((res: IAuth) => {
        const token = res.access_token;
        if (token) {
          this.setAccessToken(token);
        }
      })
    );
  }

  logout(type?: 'all' | 'other' | 'current'): Observable<any> {
    return this.postRequest(Endpoint.LOGOUT, { type }).pipe(
      tap(() => {
        this.clearAccessToken();
        this.stopRefresh();
        this.router.navigate(['/login']);
      })
    );
  }

  getProfile(): IUser | undefined {
    return this.session.getItem('profile');
    // return {
    //   modules: [
    //     'dashboard.view',
    //     'dashboard.update',
    //     'dashboard.create',
    //     'dashboard-v1.view',
    //     'dashboard-v1.update',
    //     'dashboard-v1.create',
    //     'dashboard-v2.view',
    //     'dashboard-v3.view',
    //     'tables.view',
    //     'tables-simple.view',
    //     'forms.view',
    //     'forms-general.view',
    //   ],
    // } as IUser;
  }

  isImmediateChangePassword() {
    return false;
  }
}
