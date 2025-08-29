import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
// import { inject } from '@angular/core';
// import { ToastService } from '../toast.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  // const toast = inject(ToastService);

  return next(req).pipe(
    catchError((err) => {
      console.error('HTTP error intercepted:', err);

      const errorMessage =
        err.error?.response_schema?.response_message ??
        `Error: ${err.status}`;

      if (err.status === 500) {
        // toast.error(errorMessage);
      }

      return throwError(() => err);
    })
  );
};
