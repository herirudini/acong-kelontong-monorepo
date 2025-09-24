import { Routes } from '@angular/router';
import { MainLayout } from './layout/main-layout/main-layout';
import { BRANDS, CASHIER, EXPENSES, INCOME, PRODUCTS, SUPPLIERS, INVITEUSER, USERS, ROLES, DASHBOARD } from './types/constants/menus';
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
        path: PRODUCTS.url,
        canActivate: [PageGuardService],
        data: { ...PRODUCTS },
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
        path: USERS.url,
        data: { ...USERS },
        children: [
          {
            path: '',
            canActivate: [PageGuardService],
            loadComponent: () => import('./pages/admin/users/users').then(c => c.Users),
          },
          {
            path: INVITEUSER.url,
            canActivate: [PageGuardService],
            data: { ...INVITEUSER },
            loadComponent: () => import('./pages/admin/users/user-form/user-form').then(c => c.UserForm)
          },
        ]
      },
      {
        path: ROLES.url,
        canActivate: [PageGuardService],
        data: { ...ROLES },
        loadComponent: () => import('./pages/admin/roles/roles').then(c => c.Roles)
      }
    ]
  },
  { path: 'login', loadComponent: () => import('./layout/auth-layout/login/login').then(c => c.Login) },
  { path: 'register', loadComponent: () => import('./layout/auth-layout/register/register').then(c => c.Register) },
  { path: 'error/404', loadComponent: () => import('./layout/error-layout/page-not-found/page-not-found').then(c => c.PageNotFound) },
  { path: '**', redirectTo: 'error/404' },
];
