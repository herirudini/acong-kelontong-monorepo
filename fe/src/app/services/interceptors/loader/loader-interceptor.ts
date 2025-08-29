import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';

export const loaderInterceptor: HttpInterceptorFn = (req, next) => {
  // const modalService = inject(CommonModalService);

  const spinneroff = req.params.get('spinneroff');
  req = req.clone({
    params: req.params.delete('spinneroff')
  });

  if (spinneroff === '1') {
    return next(req);
  } else {
    // modalService.spinnerOn();
    return next(req).pipe(
      finalize(() => {
        // modalService.spinnerOff();
      })
    );
  }
};
