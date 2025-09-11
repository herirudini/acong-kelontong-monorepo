import { Routes } from '@angular/router';
import { MainLayout } from './layout/main-layout/main-layout';
import { Login } from './layout/auth-layout/login/login';
import { Register } from './layout/auth-layout/register/register';
import { PageNotFound } from './layout/error-layout/page-not-found/page-not-found';
import { Menus } from './types/constants/menus';
import { AuthGuardService } from './services/guards/auth-guard/auth-guard-service';
import { PageGuardService } from './services/guards/page-guard/page-guard-service';

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
        path: Menus['DASHBOARD'].url,
        data: { ...Menus['DASHBOARD'] },
        canActivate: [PageGuardService],
        children: [
          {
            path: '',
            redirectTo: Menus['DASHBOARD'].children?.['DASHBOARD_V1'].url,
            pathMatch: 'full',
          },
          {
            path: Menus['DASHBOARD'].children?.['DASHBOARD_V1'].url,
            canActivate: [PageGuardService],
            data: { ...Menus['DASHBOARD'].children?.['DASHBOARD_V1'] },
            loadComponent: () => import('./pages/dashboard-v1/dashboard-v1').then(c => c.DashboardV1)
          },
          {
            path: Menus['DASHBOARD'].children?.['DASHBOARD_V2'].url,
            canActivate: [PageGuardService],
            data: { ...Menus['DASHBOARD'].children?.['DASHBOARD_V2'] },
            loadComponent: () => import('./pages/dashboard-v2/dashboard-v2').then(c => c.DashboardV2)
          },
          {
            path: Menus['DASHBOARD'].children?.['DASHBOARD_V3'].url,
            canActivate: [PageGuardService],
            data: { ...Menus['DASHBOARD'].children?.['DASHBOARD_V3'] },
            loadComponent: () => import('./pages/dashboard-v3/dashboard-v3').then(c => c.DashboardV3)
          },
        ]
      },
      {
        path: Menus['FORMS'].url,
        data: { ...Menus['FORMS'] },
        canActivate: [PageGuardService],
        children: [
          {
            path: '',
            redirectTo: Menus['FORMS'].children?.['GENERAL'].url,
            pathMatch: 'full',
          },
          {
            path: Menus['FORMS'].children?.['GENERAL'].url,
            canActivate: [PageGuardService],
            data: { ...Menus['FORMS'].children?.['GENERAL'] },
            loadComponent: () => import('./pages/forms/general-elements/general-elements').then(c => c.GeneralElements)
          },
        ]
      },
      {
        path: Menus['TABLES'].url,
        data: { ...Menus['TABLES'] },
        canActivate: [PageGuardService],
        children: [
          {
            path: '',
            redirectTo: Menus['TABLES'].children?.['SIMPLE'].url,
            pathMatch: 'full',
          },
          {
            path: Menus['TABLES'].children?.['SIMPLE'].url,
            canActivate: [PageGuardService],
            data: { ...Menus['TABLES'].children?.['SIMPLE'] },
            loadComponent: () => import('./pages/tables/tables-simple/tables-simple').then(c => c.TablesSimple)
          },
        ]
      },
      {
        path: Menus['CASHIER'].url,
        data: { ...Menus['CASHIER'] },
        canActivate: [PageGuardService],
        loadComponent: () => import('./pages/tables/tables-simple/tables-simple').then(c => c.TablesSimple)
      },
      {
        path: Menus['INVENTORY'].url,
        data: { ...Menus['INVENTORY'] },
        canActivate: [PageGuardService],
        children: [
          {
            path: '',
            redirectTo: Menus['INVENTORY'].children?.['PRODUCTS'].url,
            pathMatch: 'full',
          },
          {
            path: Menus['INVENTORY'].children?.['PRODUCTS'].url,
            canActivate: [PageGuardService],
            data: { ...Menus['INVENTORY'].children?.['PRODUCTS'] },
            loadComponent: () => import('./pages/tables/tables-simple/tables-simple').then(c => c.TablesSimple)
          },
          {
            path: Menus['INVENTORY'].children?.['BRANDS'].url,
            canActivate: [PageGuardService],
            data: { ...Menus['INVENTORY'].children?.['BRANDS'] },
            loadComponent: () => import('./pages/tables/tables-simple/tables-simple').then(c => c.TablesSimple)
          },
          {
            path: Menus['INVENTORY'].children?.['SUPPLIERS'].url,
            canActivate: [PageGuardService],
            data: { ...Menus['INVENTORY'].children?.['SUPPLIERS'] },
            loadComponent: () => import('./pages/tables/tables-simple/tables-simple').then(c => c.TablesSimple)
          },
        ]
      },
      {
        path: Menus['FINANCE'].url,
        data: { ...Menus['FINANCE'] },
        canActivate: [PageGuardService],
        children: [
          {
            path: '',
            redirectTo: Menus['FINANCE'].children?.['INCOME'].url,
            pathMatch: 'full',
          },
          {
            path: Menus['FINANCE'].children?.['INCOME'].url,
            canActivate: [PageGuardService],
            data: { ...Menus['FINANCE'].children?.['INCOME'] },
            loadComponent: () => import('./pages/tables/tables-simple/tables-simple').then(c => c.TablesSimple)
          },
          {
            path: Menus['FINANCE'].children?.['EXPENSES'].url,
            canActivate: [PageGuardService],
            data: { ...Menus['FINANCE'].children?.['EXPENSES'] },
            loadComponent: () => import('./pages/tables/tables-simple/tables-simple').then(c => c.TablesSimple)
          },
        ]
      },
      {
        path: Menus['ADMIN'].url,
        data: { ...Menus['ADMIN'] },
        canActivate: [PageGuardService],
        children: [
          {
            path: '',
            redirectTo: Menus['ADMIN'].children?.['USERS'].url,
            pathMatch: 'full',
          },
          {
            path: Menus['ADMIN'].children?.['USERS'].url,
            canActivate: [PageGuardService],
            data: { ...Menus['ADMIN'].children?.['USERS'] },
            loadComponent: () => import('./pages/admin/users/users').then(c => c.Users)
          },
        ]
      },
    ]
  },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'error/404', component: PageNotFound },
  { path: '**', redirectTo: 'error/404' },
];
