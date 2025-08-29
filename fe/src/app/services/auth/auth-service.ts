import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  getProfile() {
    return {
      modules: [
        { module_code: 'dashboard.view' },
        { module_code: 'dashboard.update' },
        { module_code: 'dashboard.create' },
        { module_code: 'dashboard-v1.view' },
        { module_code: 'dashboard-v1.update' },
        { module_code: 'dashboard-v1.create' },
        { module_code: 'dashboard-v2.view' },
        { module_code: 'dashboard-v3.view' },
        { module_code: 'tables.view' },
        { module_code: 'tables-simple.view' },
        { module_code: 'forms.view' },
        { module_code: 'forms-general.view' },
      ],
    };
  }

  isAuthenticated() {
    return true;
    return !!localStorage.getItem('token');
  }

  isImmediateChangePassword() {
    return false;
    return localStorage.getItem('immediateChangePassword') === 'true';
  }
}
