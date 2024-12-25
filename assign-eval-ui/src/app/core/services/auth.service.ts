import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode'; // Updated import

interface DecodedToken {
  fullName: string;
  sub: string;
  iat: number;
  exp: number;
  authorities: string[];
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8088/api/v1/auth'; // Backend API URL

  constructor(private http: HttpClient) {}

  // Login method
  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/authenticate`, credentials).pipe(
      tap({
        next: (response) => {
          const token = response.token;

          console.log('AuthService.login: Received token:', token);

          if (token) {
            this.saveSession(token);
          } else {
            console.error('AuthService.login: Missing token in response:', response);
          }
        },
        error: (error) => {
          console.error('AuthService.login: Login failed:', error);
        },
      })
    );
  }

  // Register a new user
  register(registrationData: {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    role: string;
  }): Observable<any> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/register`, registrationData).pipe(
      tap({
        next: (response) => {
          console.log('AuthService.register: Registration successful:', response);
  
          // Assuming the backend sends the token in the response after successful registration
          const token = response.token;
  
          if (token) {
            console.log('AuthService.register: Received token:', token);
            this.saveSession(token);  // Save the token in sessionStorage
          } else {
            console.error('AuthService.register: Missing token in response:', response);
          }
        },
        error: (error) => {
          console.error('AuthService.register: Registration failed:', error);
        },
      })
    );
  }

  // Save session data to sessionStorage
  private saveSession(token: string): void {
    console.log('Saving token to sessionStorage:', token);  // Log the token being saved
    sessionStorage.setItem('authToken', token);
  
    try {
      const decoded: DecodedToken = jwtDecode(token) as DecodedToken;
      const role = decoded.authorities && decoded.authorities.length > 0
        ? decoded.authorities[0].replace('ROLE_', '')  // Remove 'ROLE_' prefix if present
        : null;
      const userId = decoded.sub; // Assuming 'sub' is the user (developer) ID in the token
      
      sessionStorage.setItem('userRole', role || '');
      sessionStorage.setItem('userId', userId || '');  // Save developer ID (numeric)
      console.log('Token, role, and user ID saved to sessionStorage');
    } catch (error) {
      console.error('Failed to decode token:', error);
      sessionStorage.setItem('userRole', '');
      sessionStorage.setItem('userId', '');
    }
  }
  
  
  // Get token from sessionStorage
  getToken(): string | null {
    return sessionStorage.getItem('authToken');
  }

  // Get user role from sessionStorage
  getUserRole(): string | null {
    return sessionStorage.getItem('userRole');
  }

  // Check if the user is authenticated
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // Logout and clear sessionStorage
  logout(): Observable<void> {
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('userRole');
    console.log('AuthService.logout: User logged out and sessionStorage cleared');
    return of(); // Return an Observable to use .subscribe()
  }

  // Validate activation code (e.g., account activation after registration)
  validateCode(code: string): Observable<{ role: string }> {
    return this.http.get<{ role: string }>(`${this.apiUrl}/activate-account?token=${code}`).pipe(
      tap({
        next: (response) => {
          console.log('AuthService.validateCode: Activation code validated:', response);
          // Optionally, you can set the role or perform other actions here
        },
        error: (error) => {
          console.error('AuthService.validateCode: Activation code validation failed:', error);
        },
      })
    );
  }

  // Get developer ID from sessionStorage
  getUserId(): string | null {
    const userId = sessionStorage.getItem('userId');
    console.log('getUserId: Retrieved user ID from sessionStorage:', userId); // Log the retrieved ID
    return userId;
  }

  
}

