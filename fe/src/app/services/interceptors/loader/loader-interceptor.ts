import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { PageSpinnerService } from '../../../shared/components/page-spinner/page-spinner-service';

export const loaderInterceptor: HttpInterceptorFn = (req, next) => {
  const pageSpinnerService = inject(PageSpinnerService);

  const spinner = req.params.get('spinner');
  req = req.clone({
    params: req.params.delete('spinner')
  });

  if (spinner) {
    return next(req);
  } else {
    pageSpinnerService.spinnerOn();
    return next(req).pipe(
      finalize(() => {
        pageSpinnerService.spinnerOff();
      })
    );
  }
};
