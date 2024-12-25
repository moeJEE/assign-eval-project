// src/app/core/guards/logged-in.guard.ts

import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '@app/core/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class LoggedInGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

  canActivate(): boolean {
    const userRole = this.authService.getUserRole();
    console.debug('LoggedInGuard.canActivate: Retrieved user role', userRole);

    if (userRole) {
      if (userRole.toLowerCase() === 'developer') {
        console.debug('LoggedInGuard.canActivate: Redirecting to developer dashboard');
        this.router.navigate(['/developer-dashboard']);
      } else if (userRole.toLowerCase() === 'project_manager') {
        console.debug('LoggedInGuard.canActivate: Redirecting to project manager dashboard');
        this.router.navigate(['/project-manager-dashboard']);
      } else {
        console.warn('LoggedInGuard.canActivate: Unknown role. Redirecting to error page.');
        this.router.navigate(['/auth/error']);
      }
      return false; // Prevent access to login/register pages if user role exists
    }

    console.debug('LoggedInGuard.canActivate: No session found. Access granted.');
    return true;
  }
}
