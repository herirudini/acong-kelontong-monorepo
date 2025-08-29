import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, UrlTree } from '@angular/router';
import { Previleges } from '../../../_previleges';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PageGuardService {
  constructor(private previleges: Previleges) { }

  canActivate(route: ActivatedRouteSnapshot): | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    
    const menuList = this.previleges.getMenuList();
    const hasPermission = menuList?.find(item => {
      const children = item.mappedChildren;
      if (item.code === route.data['code']) {
        console.log('has permission', item.code);
        return true;
      } else if (children) {
        console.log('checking children permissions', children);
        return children.find(child => child.code === route.data['code']);
      }
      return false;
    });

    if (!hasPermission) {
      console.log('no permission');
      return false;
    }

    return true;
  }
}
