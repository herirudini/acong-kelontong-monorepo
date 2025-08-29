import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { loaderInterceptor } from './services/interceptors/loader/loader-interceptor';
import { errorInterceptor } from './services/interceptors/error/error-interceptor';
import { Previleges } from './_previleges';
import { BaseService } from './services/rest-api/base-service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),

    provideHttpClient(
      withInterceptors([
        loaderInterceptor,
        errorInterceptor, // order matters, loader runs first, error second
      ])
    ),

    BaseService,
    Previleges
  ]
};
