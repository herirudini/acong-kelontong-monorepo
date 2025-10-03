import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, switchMap, throwError, finalize, filter, take } from 'rxjs';
import { inject } from '@angular/core';
import { AlertService } from '../../../shared/components/alert/alert-service';
import { errCodes } from '../../../types/constants/common.constants';
import { AuthService } from '../../auth/auth-service';
import { BehaviorSubject } from 'rxjs';

let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const alert = inject(AlertService);
  const auth = inject(AuthService);

  return next(req).pipe(
    catchError((err) => {
      const errCode = err?.error?.error_code;
      const errorMessage = err?.error?.message ?? `Error: ${err?.status ?? 'Unknown'}`;

      if (errCode === errCodes.authGuard) {
        if (!isRefreshing) {
          isRefreshing = true;
          refreshTokenSubject.next(null);

          return auth.refreshToken().pipe(
            switchMap((res) => {
              isRefreshing = false;
              refreshTokenSubject.next(res.detail.access_token);

              // retry original request with new token
              const clone = req.clone({
                setHeaders: { Authorization: `Bearer ${res.detail.access_token}` },
              });
              return next(clone);
            }),
            catchError((refreshErr) => {
              isRefreshing = false;
              alert.error('Session expired. Please login again.');
              auth.logout();
              return throwError(() => refreshErr);
            }),
            finalize(() => {
              isRefreshing = false;
            })
          );
        } else {
          // Already refreshing → queue up other request until refreshTokenSubject emits
          return refreshTokenSubject.pipe(
            filter((token) => token !== null),
            take(1),
            switchMap((token) => {
              const clone = req.clone({
                setHeaders: { Authorization: `Bearer ${token}` },
              });
              return next(clone);
            })
          );
        }
      }

      // Other errors → just show alert
      alert.error(errorMessage);
      return throwError(() => err);
    })
  );
};
