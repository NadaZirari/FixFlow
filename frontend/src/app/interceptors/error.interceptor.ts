import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        authService.logout(false);
        router.navigate(['/login']);
      } else if (error.status === 403) {
        if (error.error?.error === 'ACCOUNT_DISABLED') {
          authService.logout(false);
          router.navigate(['/login'], {
            queryParams: { error: 'account_disabled' }
          });
        }
      }
      return throwError(() => error);
    })
  );
};
