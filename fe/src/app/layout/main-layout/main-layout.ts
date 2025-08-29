import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Previleges } from '../../_previleges';
import { IMenu } from '../../types/interfaces/menu.interface';
import { NavigationService } from '../../services/navigation/navigation-service';
import { IBreadcrumb } from '../../types/interfaces/breadcrumb.interface';
import { Alert } from '../../shared/components/alert/alert';
import { PageSpinner } from '../../shared/components/page-spinner/page-spinner';
@Component({
  selector: 'app-main-layout',
  imports: [CommonModule, RouterModule, Alert, PageSpinner],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss'
})
export class MainLayout {
  menuItems: IMenu[] = [];
  breadcrumbs: IBreadcrumb[] = [];
  pageTitle: string = '';
  
  constructor(private previleges: Previleges, private navSvc: NavigationService, private router: Router, protected activatedRoute: ActivatedRoute) {
    this.menuItems = this.previleges.getMenuList();
    this.breadcrumbs = navSvc.buildBreadCrumb();
    this.navSvc.breadcrumbs.subscribe((val) => {
      this.breadcrumbs = val;
      if (this.breadcrumbs.length > 0) this.breadcrumbs.at(-1)!.disabled = true;
      this.pageTitle = this.breadcrumbs.length > 0 ? this.breadcrumbs.at(-1)?.labelKey||'' : '';
    })
  }
  navigate(url:any) {
    this.router.navigate([url]);
  }
}
