// src/app/auth/pages/login/login.component.ts

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '@app/core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
    `
      :host ::ng-deep .p-password input {
        width: 100%;
        padding: 1rem;
      }
      :host ::ng-deep .pi-eye,
      :host ::ng-deep .pi-eye-slash {
        transform: scale(1.6);
        margin-right: 1rem;
        color: var(--primary-color) !important;
      }
    `,
  ],
})
export class LoginComponent {
  email!: string;
  password!: string;

  constructor(private authService: AuthService, private router: Router) {}

  onLogin(): void {
    const credentials = {
      email: this.email,
      password: this.password,
    };

    this.authService.login(credentials).subscribe({
      next: () => {
        const role = this.authService.getUserRole();
        console.log('LoginComponent.onLogin: Retrieved role:', role);

        if (role) {
          // Remove 'ROLE_' prefix if present
          const normalizedRole = role.startsWith('ROLE_') ? role.slice(5) : role;
          const upperCaseRole = normalizedRole.toUpperCase();

          if (upperCaseRole === 'DEVELOPER') {
            this.router.navigate(['/developer-dashboard']);
          } else if (upperCaseRole === 'PROJECT_MANAGER') {
            this.router.navigate(['/project-manager-dashboard']);
          } else {
            console.warn('LoginComponent.onLogin: Unknown role. Redirecting to error page.');
            this.router.navigate(['/auth/error']);
          }
        } else {
          console.error('LoginComponent.onLogin: userRole is undefined. Redirecting to error page.');
          this.router.navigate(['/auth/error']);
        }
      },
      error: (err: HttpErrorResponse) => {
        console.error('LoginComponent.onLogin: Error during login:', err);
        alert('Login failed. Please try again.');
      },
    });
  }
}