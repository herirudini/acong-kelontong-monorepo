import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { AlertService } from '../../../shared/components/alert/alert-service';
import { inject } from '@angular/core';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const alert = inject(AlertService);

  return next(req).pipe(
    catchError((err) => {
      console.error('HTTP error intercepted:', err);
      const errorMessage = err.error?.response_schema?.response_message ?? `Error: ${err.status}`;
      alert.error(errorMessage);
      return throwError(() => err);
    })
  );
};
