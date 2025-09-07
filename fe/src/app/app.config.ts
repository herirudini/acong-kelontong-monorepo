import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { loaderInterceptor } from './services/interceptors/loader/loader-interceptor';
import { errorInterceptor } from './services/interceptors/error/error-interceptor';
import { Previleges } from './_previleges';
import { BaseService } from './services/rest-api/base-service';
import { tokenInterceptor } from './services/interceptors/token/token-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),

    provideHttpClient(
      withFetch(),
      withInterceptors([
        loaderInterceptor,
        tokenInterceptor,
        errorInterceptor, // order matters, loader runs first, error last
      ])
    ),

    BaseService,
    Previleges
  ]
};
