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
        // Try to refresh token
        return auth.refreshToken().pipe(
          switchMap((res) => {
            const clone = req.clone({
              setHeaders: {
                Authorization: `Bearer ${res.detail.access_token}`,
              },
            });
            return next(clone); // retry request
          }),
          catchError((refreshErr) => {
            alert.error('Session expired. Please login again.');
            console.error('Session expired. Please login again.');
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
