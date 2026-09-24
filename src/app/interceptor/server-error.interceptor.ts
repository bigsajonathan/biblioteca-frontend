import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, EMPTY, retry } from 'rxjs';
import { environment } from '../../environments/environment.development';

export const serverErrorInterceptor: HttpInterceptorFn = (req, next) => {

    const snackBar = inject(MatSnackBar);

    const retryCount = req.method === 'GET' ? environment.RETRY : 0;

    return next(req).pipe(
        retry({ count: retryCount, delay: 1000 }),
        catchError((err) => {
            if (err.status === 400) {
                snackBar.open(err.error.message, 'ERROR 400', { duration: 5000 });
            } else if (err.status === 404) {
                snackBar.open('No existe el recurso', 'ERROR 404', { duration: 5000 });
            } else if (err.status === 500) {
                snackBar.open(err.error.message, 'ERROR 500', { duration: 5000 });
            } else {
                snackBar.open(err.error?.message ?? 'Error inesperado', 'ERROR', { duration: 5000 });
            }

            return EMPTY;
        })
    );
};
