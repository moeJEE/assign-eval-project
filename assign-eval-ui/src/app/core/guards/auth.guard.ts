import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '@app/core/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    // Retrieve user role from AuthService
    const userRole = this.authService.getUserRole();
    console.debug('AuthGuard.canActivate: Retrieved user role:', userRole);

    // Redirect to login if no role is found
    if (!userRole) {
      console.warn('AuthGuard.canActivate: No user role found. Redirecting to login.');
      this.router.navigate(['/auth/login']);
      return false;
    }

    // Normalize user role (remove ROLE_ prefix and convert to uppercase)
    const normalizedUserRole = this.normalizeRole(userRole);
    console.debug('AuthGuard.canActivate: Normalized user role:', normalizedUserRole);

    // Retrieve and normalize allowed roles from route data
    const allowedRoles = route.data['roles'] as Array<string> || [];
    const normalizedAllowedRoles = allowedRoles.map(this.normalizeRole);
    console.debug('AuthGuard.canActivate: Normalized allowed roles:', normalizedAllowedRoles);

    // Check if user role is allowed
    if (normalizedAllowedRoles.includes(normalizedUserRole)) {
      console.debug('AuthGuard.canActivate: Access granted.');
      return true;
    }

    // Redirect to error page if access is denied
    console.warn('AuthGuard.canActivate: Access denied. Redirecting to error page.');
    this.router.navigate(['/auth/error']);
    return false;
  }

  /**
   * Helper method to normalize roles by removing the "ROLE_" prefix and converting to uppercase.
   * @param role The role to normalize.
   * @returns The normalized role.
   */
  private normalizeRole(role: string): string {
    return role.replace(/^ROLE_/, '').toUpperCase();
  }
}
