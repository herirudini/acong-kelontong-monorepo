import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, switchMap, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { AlertService } from '../../../shared/components/alert/alert-service';
import { errCodes } from '../../../types/constants/common.constants';
import { AuthService } from '../../auth/auth-service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const alert = inject(AlertService);
  const auth = inject(AuthService);

  return next(req).pipe(
    catchError((err) => {

      const errCode = err?.error?.error_code;
      const errorMessage = err?.error?.message ?? `Error: ${err?.status}`;
      console.error('HTTP error intercepted:', { errCode, errorMessage, err });

      if (errCode === errCodes.authGuard) {
        // Attempt token refresh and retry request
        return auth.refreshToken().pipe(
          switchMap(() => {
            return next(req); // retry original request
          }),
          catchError(refreshErr => {
            // Refresh also failed → logout or alert
            alert.error('Session expired. Please login again.');
            auth.logout();
            return throwError(() => refreshErr);
          })
        );
      }

      // Other errors → just show alert
      alert.error(errorMessage);
      return throwError(() => err);
    })
  );
};
