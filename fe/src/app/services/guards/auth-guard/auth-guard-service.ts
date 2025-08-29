import { Injectable } from '@angular/core';
import { AuthService } from '../../auth/auth-service';
import { Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  constructor(private auth: AuthService, private router: Router) { }

  canActivate(state: RouterStateSnapshot): | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (!this.auth.isAuthenticated()) {
      this.router.navigate(['/login'], { queryParams: { redirect: state.url } });
      console.log('not authenticated');
      return false;
    }
    if (this.auth.isImmediateChangePassword()) {
      this.router.navigate(['/immediate-change-password'], {
        queryParams: { redirect: state.url },
      });
      console.log('immediate change password');
      return false;
    }

    return true;
  }
}
