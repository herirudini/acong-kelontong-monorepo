import { Routes } from '@angular/router';
import { MainLayout } from './layout/main-layout/main-layout';
import { Login } from './layout/auth-layout/login/login';
import { Register } from './layout/auth-layout/register/register';
import { PageNotFound } from './layout/error-layout/page-not-found/page-not-found';
import { Menus } from './types/constants/menus';

export const routes: Routes = [
  {
    path: '',
    redirectTo: Menus['DASHBOARD'].url,
    pathMatch: 'full'
  },
  {
    path: '',
    component: MainLayout,
    children: [
      {
        path: Menus['DASHBOARD'].url,
        data: { title: Menus['DASHBOARD'].labelKey },
        children: [
          {
            path: '',
            redirectTo: Menus['DASHBOARD'].children?.['DASHBOARD_V1'].url,
            pathMatch: 'full',
          },
          {
            path: Menus['DASHBOARD'].children?.['DASHBOARD_V1'].url,
            canActivate: [],
            data: { title: Menus['DASHBOARD'].children?.['DASHBOARD_V1'].labelKey },
            loadComponent: () => import('./pages/dashboard-v1/dashboard-v1').then(c => c.DashboardV1)
          },
          {
            path: Menus['DASHBOARD'].children?.['DASHBOARD_V2'].url,
            canActivate: [],
            data: { title: Menus['DASHBOARD'].children?.['DASHBOARD_V2'].labelKey },
            loadComponent: () => import('./pages/dashboard-v2/dashboard-v2').then(c => c.DashboardV2)
          },
          {
            path: Menus['DASHBOARD'].children?.['DASHBOARD_V3'].url,
            canActivate: [],
            data: { title: Menus['DASHBOARD'].children?.['DASHBOARD_V3'].labelKey },
            loadComponent: () => import('./pages/dashboard-v3/dashboard-v3').then(c => c.DashboardV3)
          },
        ]
      },
      {
        path: Menus['FORMS'].url,
        data: { title: Menus['FORMS'].labelKey },
        children: [
          {
            path: '',
            redirectTo: Menus['FORMS'].children?.['GENERAL'].url,
            pathMatch: 'full',
          },
          {
            path: Menus['FORMS'].children?.['GENERAL'].url,
            canActivate: [],
            data: { title: Menus['FORMS'].children?.['GENERAL'].labelKey },
            loadComponent: () => import('./pages/forms/general-elements/general-elements').then(c => c.GeneralElements)
          },
        ]
      },
      {
        path: Menus['TABLES'].url,
        data: { title: Menus['TABLES'].labelKey },
        children: [
          {
            path: '',
            redirectTo: Menus['TABLES'].children?.['SIMPLE'].url,
            pathMatch: 'full',
          },
          {
            path: Menus['TABLES'].children?.['SIMPLE'].url,
            canActivate: [],
            data: { title: Menus['TABLES'].children?.['SIMPLE'].labelKey },
            loadComponent: () => import('./pages/tables/tables-simple/tables-simple').then(c => c.TablesSimple)
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
