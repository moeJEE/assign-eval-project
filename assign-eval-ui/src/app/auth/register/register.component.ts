import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '@app/core/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
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
export class RegisterComponent {
  firstname!: string;
  lastname!: string;
  email!: string;
  password!: string;
  dateOfBirth!: string;
  portfolio!: string;
  available: boolean = true;
  teamSize: number | null = null;
  role: string = 'DEVELOPER'; // Default role value

  constructor(private authService: AuthService, private router: Router) {}

  onRegister(): void {
    const user = {
      firstname: this.firstname,
      lastname: this.lastname,
      email: this.email,
      password: this.password,
      dateOfBirth: this.dateOfBirth,
      role: this.role,
    };
  
    this.authService.register(user).subscribe({
      next: (response: any) => {
        // Optionally store role in localStorage for later use
        localStorage.setItem('userRole', this.role);
        alert('Registration successful!');
        this.router.navigate(['/auth/register/validate-code']);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error during registration:', err);
        alert('Registration failed. Please try again.');
      },
    });
  }
  
}
