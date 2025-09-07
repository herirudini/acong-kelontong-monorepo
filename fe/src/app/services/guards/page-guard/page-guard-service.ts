import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { ActivatedRouteSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { isPlatformServer } from '@angular/common';
import { AuthService } from '../../auth/auth-service';

@Injectable({
  providedIn: 'root'
})
export class PageGuardService {
  constructor(private authSvc: AuthService, @Inject(PLATFORM_ID) private platformId: Object) { }

  canActivate(route: ActivatedRouteSnapshot): | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (isPlatformServer(this.platformId)) {
      // ✅ On the server: don't block, let browser handle it
      return true;
    }

    // ✅ On the browser: enforce real guard
    const modules = this.authSvc.getProfile()?.modules || [];
    const permissionAsk = route.data['permissions'];
    const hasPermission = modules.some(item=>permissionAsk.includes(item))

    if (!hasPermission) {
      console.log('no permission');
      return false;
    }

    return true;
  }
}
