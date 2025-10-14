import { Routes } from '@angular/router';
import { MainLayout } from './layout/main-layout/main-layout';
import { BRANDS, CASHIER, EXPENSES, INCOME, PRODUCT, SUPPLIERS, USER, ROLE, DASHBOARD, ROLE_DETAIL, ROLE_CREATE, ROLE_EDIT } from './types/constants/menus';
import { AuthGuardService } from './services/guards/auth-guard/auth-guard-service';
import { PageGuardService } from './services/guards/page-guard/page-guard-service';

export const routes: Routes = [
  {
    path: '',
    redirectTo: DASHBOARD.url,
    pathMatch: 'full'
  },
  {
    path: '',
    component: MainLayout,
    canActivate: [AuthGuardService],
    children: [
      // TODO: remove this dummy later
      {
        path: DASHBOARD.url,
        data: { ...DASHBOARD },
        loadComponent: () => import('./pages/dashboard-v1/dashboard-v1').then(c => c.DashboardV1)
      },
      {
        path: CASHIER.url,
        data: { ...CASHIER },
        canActivate: [PageGuardService],
        loadComponent: () => import('./pages/dashboard-v2/dashboard-v2').then(c => c.DashboardV2)
      },
      {
        path: PRODUCT.url,
        canActivate: [PageGuardService],
        data: { ...PRODUCT },
        loadComponent: () => import('./pages/dashboard-v3/dashboard-v3').then(c => c.DashboardV3)
      },
      {
        path: BRANDS.url,
        canActivate: [PageGuardService],
        data: { ...BRANDS },
        loadComponent: () => import('./pages/tables/tables-simple/tables-simple').then(c => c.TablesSimple)
      },
      {
        path: SUPPLIERS.url,
        canActivate: [PageGuardService],
        data: { ...SUPPLIERS },
        loadComponent: () => import('./pages/forms/general-elements/general-elements').then(c => c.GeneralElements)
      },
      {
        path: INCOME.url,
        canActivate: [PageGuardService],
        data: { ...INCOME },
        loadComponent: () => import('./pages/forms/general-elements/general-elements').then(c => c.GeneralElements)
      },
      {
        path: EXPENSES.url,
        canActivate: [PageGuardService],
        data: { ...EXPENSES },
        loadComponent: () => import('./pages/forms/general-elements/general-elements').then(c => c.GeneralElements)
      },
      {
        path: ROLE.url,
        data: { ...ROLE },
        children: [
          {
            path: '',
            canActivate: [PageGuardService],
            loadComponent: () => import('./pages/admin/roles/roles').then(c => c.Roles)
          },
          {
            path: ROLE_CREATE.url,
            canActivate: [PageGuardService],
            data: { ...ROLE_CREATE },
            loadComponent: () => import('./pages/admin/roles/roles-form/roles-form').then(c => c.RolesForm)
          },
          {
            path: ROLE_DETAIL.url,
            canActivate: [PageGuardService],
            data: { ...ROLE_DETAIL },
            loadComponent: () => import('./pages/admin/roles/roles-form/roles-form').then(c => c.RolesForm)
          },
          {
            path: ROLE_EDIT.url,
            canActivate: [PageGuardService],
            data: { ...ROLE_EDIT },
            loadComponent: () => import('./pages/admin/roles/roles-form/roles-form').then(c => c.RolesForm)
          },
        ]
      },
      {
        path: USER.url,
        canActivate: [PageGuardService],
        data: { ...USER },
        loadComponent: () => import('./pages/admin/user/user').then(c => c.User),
      }
    ]
  },
  { path: 'login', loadComponent: () => import('./layout/auth-layout/login/login').then(c => c.Login) },
  { path: 'user-verification/:ticket', loadComponent: () => import('./pages/admin/user/user-verification/user-verification').then(c => c.UserVerification) },
  { path: 'error/404', loadComponent: () => import('./layout/error-layout/page-not-found/page-not-found').then(c => c.PageNotFound) },
  { path: '**', redirectTo: 'error/404' },
];
