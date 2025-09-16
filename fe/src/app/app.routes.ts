import { Routes } from '@angular/router';
import { MainLayout } from './layout/main-layout/main-layout';
import { Login } from './layout/auth-layout/login/login';
import { Register } from './layout/auth-layout/register/register';
import { PageNotFound } from './layout/error-layout/page-not-found/page-not-found';
import { ADMIN, BRANDS, CASHIER, EXPENSES, FINANCE, INCOME, INVENTORY, Menus, PRODUCTS, SUPPLIERS, INVITEUSER, USERS } from './types/constants/menus';
import { AuthGuardService } from './services/guards/auth-guard/auth-guard-service';
import { PageGuardService } from './services/guards/page-guard/page-guard-service';
import { Users } from './pages/admin/users/users';
import { UserForm } from './pages/admin/users/user-form/user-form';
import { TablesSimple } from './pages/tables/tables-simple/tables-simple';

export const routes: Routes = [
  {
    path: '',
    redirectTo: Menus['DASHBOARD'].url,
    pathMatch: 'full'
  },
  {
    path: '',
    component: MainLayout,
    canActivate: [AuthGuardService],
    children: [
      {
        path: CASHIER.url,
        data: { ...CASHIER },
        canActivate: [PageGuardService],
        component: TablesSimple
      },
      {
        path: INVENTORY.url,
        data: { ...INVENTORY },
        children: [
          {
            path: '',
            redirectTo: PRODUCTS.url,
            pathMatch: 'full',
          },
          {
            path: PRODUCTS.url,
            canActivate: [PageGuardService],
            data: { ...PRODUCTS },
            component: TablesSimple
          },
          {
            path: BRANDS.url,
            canActivate: [PageGuardService],
            data: { ...BRANDS },
            component: TablesSimple
          },
          {
            path: SUPPLIERS.url,
            canActivate: [PageGuardService],
            data: { ...SUPPLIERS },
            component: TablesSimple
          },
        ]
      },
      {
        path: FINANCE.url,
        data: { ...FINANCE },
        children: [
          {
            path: '',
            redirectTo: INCOME.url,
            pathMatch: 'full',
          },
          {
            path: INCOME.url,
            canActivate: [PageGuardService],
            data: { ...INCOME },
            component: TablesSimple
          },
          {
            path: EXPENSES.url,
            canActivate: [PageGuardService],
            data: { ...EXPENSES },
            component: TablesSimple
          },
        ]
      },
      {
        path: ADMIN.url,
        data: { ...ADMIN },
        children: [
          {
            path: '',
            redirectTo: USERS.url,
            pathMatch: 'full',
          },
          {
            path: USERS.url,
            data: { ...USERS },
            children: [
              {
                path: '',
                canActivate: [PageGuardService],
                component: Users,
              },
              {
                path: INVITEUSER.url,
                canActivate: [PageGuardService],
                data: { ...INVITEUSER },
                component: UserForm
              },
            ]
          },
        ]
      },

      // TODO: remove this dummy later
      {
        path: Menus['DASHBOARD'].url,
        data: { ...Menus['DASHBOARD'] },
        children: [
          {
            path: '',
            redirectTo: Menus['DASHBOARD'].children?.['DASHBOARD_V1'].url,
            pathMatch: 'full',
          },
          {
            path: Menus['DASHBOARD'].children?.['DASHBOARD_V1'].url,
            data: { ...Menus['DASHBOARD'].children?.['DASHBOARD_V1'] },
            loadComponent: () => import('./pages/dashboard-v1/dashboard-v1').then(c => c.DashboardV1)
          },
          {
            path: Menus['DASHBOARD'].children?.['DASHBOARD_V2'].url,
            data: { ...Menus['DASHBOARD'].children?.['DASHBOARD_V2'] },
            loadComponent: () => import('./pages/dashboard-v2/dashboard-v2').then(c => c.DashboardV2)
          },
          {
            path: Menus['DASHBOARD'].children?.['DASHBOARD_V3'].url,
            data: { ...Menus['DASHBOARD'].children?.['DASHBOARD_V3'] },
            loadComponent: () => import('./pages/dashboard-v3/dashboard-v3').then(c => c.DashboardV3)
          },
        ]
      },
      {
        path: Menus['FORMS'].url,
        data: { ...Menus['FORMS'] },
        children: [
          {
            path: '',
            redirectTo: Menus['FORMS'].children?.['GENERAL'].url,
            pathMatch: 'full',
          },
          {
            path: Menus['FORMS'].children?.['GENERAL'].url,
            data: { ...Menus['FORMS'].children?.['GENERAL'] },
            loadComponent: () => import('./pages/forms/general-elements/general-elements').then(c => c.GeneralElements)
          },
        ]
      },
      {
        path: Menus['TABLES'].url,
        data: { ...Menus['TABLES'] },
        children: [
          {
            path: '',
            redirectTo: Menus['TABLES'].children?.['SIMPLE'].url,
            pathMatch: 'full',
          },
          {
            path: Menus['TABLES'].children?.['SIMPLE'].url,
            data: { ...Menus['TABLES'].children?.['SIMPLE'] },
            component: TablesSimple
          },
        ]
      }
    ]
  },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'error/404', component: PageNotFound },
  { path: '**', redirectTo: 'error/404' },
];
