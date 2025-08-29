import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { IBreadcrumb } from '../../types/interfaces/breadcrumb.interface';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  customIds: { [key: string]: any } = {};
  breadcrumbs: BehaviorSubject<Array<IBreadcrumb>> = new BehaviorSubject<Array<IBreadcrumb>>([] as IBreadcrumb[]);

  lastState?: string;
  constructor(private route: ActivatedRoute, private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.buildBreadCrumb();
      }
    });
  }

  setBreadcrumbs(_bs: Array<IBreadcrumb>) {
    this.breadcrumbs.next(_bs);
  }

  updateBreadcrumbs(_bs: Array<IBreadcrumb>) {
    this.setBreadcrumbs(_bs);
  }

  buildBreadCrumb(): Array<IBreadcrumb> {
    let route: ActivatedRoute | null = this.route;
    let url = '';
    const breadcrumbs: IBreadcrumb[] = [];
    while (route) {
      const path = route.routeConfig ? route.routeConfig.path : '';
      let labelKey = route.routeConfig?.data?.['title'] || '';
      const nextUrl = `${url}${path}/`;
      url = nextUrl;
      route = route.firstChild;
      if (labelKey) breadcrumbs.push({ labelKey, url, disabled: false } as IBreadcrumb);
    }
    this.updateBreadcrumbs(breadcrumbs);
    setTimeout(() => {
      if (breadcrumbs[breadcrumbs.length - 1]?.labelKey !== this.lastState) {
        this.lastState = breadcrumbs[breadcrumbs.length - 1]?.labelKey;
      }
    }, 500);
    return breadcrumbs;
  }
}
