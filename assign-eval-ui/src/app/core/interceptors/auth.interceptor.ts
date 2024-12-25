// src/app/core/interceptors/auth.interceptor.ts

import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '@app/core/services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private apiUrl = 'http://localhost:8088/api/v1'; // Backend API URL

  constructor(private authService: AuthService, private router: Router) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const authToken = this.authService.getToken();

    console.debug(`AuthInterceptor: Retrieved token: ${authToken}`);

    // Only add the Authorization header to API requests
    const isApiUrl = req.url.startsWith(this.apiUrl);
    if (isApiUrl && authToken) {
      const authReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${authToken}`),
      });
      console.debug(
        `AuthInterceptor: Attaching Authorization header to API request to: ${req.url}`
      );
      return next.handle(authReq).pipe(
        catchError((error: HttpErrorResponse) => {
          console.error(
            `AuthInterceptor: Error during API request to ${req.url}:`,
            error
          );
          if (error.status === 401 || error.status === 403) {
            // Token might be expired or invalid, log out the user
            this.authService.logout();
            this.router.navigate(['/auth/login']);
          }
          return throwError(error);
        })
      );
    }

    console.debug(
      `AuthInterceptor: No Authorization header attached for request to: ${req.url}`
    );
    return next.handle(req);
  }
}
