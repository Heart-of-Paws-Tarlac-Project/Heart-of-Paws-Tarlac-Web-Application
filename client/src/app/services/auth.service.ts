import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { AdminAuthService } from './admin-auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // BehaviorSubject<boolean>: A BehaviorSubject is used to store the current authentication state (true or false). It allows components to subscribe to it and get notified whenever the state changes.
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

  // isAuthenticated$: This is the observable version of isAuthenticatedSubject. Components can subscribe to this to get updates when the authentication state changes.
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private apiService: ApiService,
    private adminAuthService: AdminAuthService
  ) {
    // Check authentication status when service initializes
    this.checkAuthStatus();
  }

  // The checkAuthStatus() method makes an HTTP GET request to the server (/auth/is-authenticated), which is expected to return whether the user is authenticated or not. Based on the response from the server, the authentication state is updated.
  private checkAuthStatus() {
    this.apiService.get(`/auth/is-authenticated`).subscribe({
      next: (response) => {
        if (response.message === 'Authenticated') {
          this.isAuthenticatedSubject.next(true);
        } else {
          this.isAuthenticatedSubject.next(false);
        }
      },
      error: () => {
        this.isAuthenticatedSubject.next(false);
      },
    });
  }

  registerUser(credentials: { name: string; email: string; password: string }) {
    return this.apiService.post(`/auth/register`, credentials).pipe(
      tap((response) => {
        if (
          response.message ===
          `User ${credentials.name} successfully registered`
        ) {
          this.isAuthenticatedSubject.next(false);
        }
      })
    );
  }

  loginUser(credentials: { email: string; password: string }) {
    return this.apiService.post(`/auth/login`, credentials).pipe(
      tap((response) => {
        if (response || response.message === 'User logged in successfully') {
          if (response.role === 'admin') {
            this.adminAuthService.isAdminAuthenticatedSubject.next(true);
            return;
          }
          console.log(`response id: ${response.id}`);
          localStorage.setItem('userName', response.name);
          localStorage.setItem('userId', response.id);
          this.isAuthenticatedSubject.next(true);
        }
      })
    );
  }

  logout() {
    return this.apiService.post(`/auth/logout`, {}).pipe(
      tap((response) => {
        localStorage.removeItem('userId');
        if (response.message === 'Logout successful.') {
          this.isAuthenticatedSubject.next(false);
        }
      })
    );
  }

  isAuthenticated() {
    return this.apiService.get(`/auth/is-authenticated`);
  }
}
