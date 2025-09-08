import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../../environments/environment';
import { decrypt, encrypt } from './encryption';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private cookies: CookieService) { }

  setItem(key: string, value: any): void {
    // Store in cookie so both SSR and browser can read it
    // httpOnly cookie is better if set by backend
    this.cookies.set(key, encrypt(value), {
      path: '/',
      secure: environment.production, // set true if https
      sameSite: 'Lax',
    });
  }

  getItem<T>(key: string): T | undefined {
    const item = this.cookies.get(key);
    return decrypt(item)
  }

  removeItem(key: string): void {
    this.cookies.delete(key, '/');
  }

  clear(): void {
    this.cookies.deleteAll('/')
  }
}