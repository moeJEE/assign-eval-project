// validate-code.component.ts

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '@app/core/services/auth.service';

@Component({
  selector: 'app-validate-code',
  templateUrl: './validate-code.component.html',
})
export class ValidateCodeComponent {
  validationCode: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onValidate(): void {
    if (!this.validationCode.trim()) {
      alert('Please enter a valid code.');
      return;
    }
  
    this.authService.validateCode(this.validationCode).subscribe({
      next: (response: any) => {
        if (!response || !response.role) {
          alert('Role information is missing. Please contact support.');
          this.router.navigate(['/auth/error']);
          return;
        }
  
        alert('Validation successful!');
  
        // Store the role in sessionStorage instead of localStorage
        sessionStorage.setItem('userRole', response.role);
  
        // Navigate based on role
        const role = response.role;
        if (role === 'DEVELOPER') {
          this.router.navigate(['/developer-dashboard']);
        } else if (role === 'PROJECT_MANAGER') {
          this.router.navigate(['/project-manager-dashboard']);
        } else {
          alert('Invalid role!');
          this.router.navigate(['/auth/error']);
        }
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error validating code:', err);
        alert('Validation failed. Please check the code and try again.');
      },
    });
  }
  
  
  
  
}
