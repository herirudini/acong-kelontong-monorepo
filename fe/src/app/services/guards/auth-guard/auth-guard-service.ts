import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { AuthService } from '../../auth/auth-service';
import { Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { isPlatformServer } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  constructor(private auth: AuthService, private router: Router, @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  canActivate(state: RouterStateSnapshot): | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (isPlatformServer(this.platformId)) {
      // ✅ On the server: don't block, let browser handle it
      return true;
    }

    // ✅ On the browser: enforce real auth
    if (this.auth.isAuthenticated()) {
      return true;
    }
    
    // SSR-safe redirect
    return this.router.parseUrl('/login');
  }
}
