import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError, tap } from 'rxjs';
import { Router } from '@angular/router';
import { AuthRequest, AuthResponse, RegisterRequest, User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API = 'http://localhost:8081/api/v1/auth';
  private currentUserSubject = new BehaviorSubject<User | null>(this.loadUser());
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  private loadUser(): User | null {
    const token = localStorage.getItem('token');
    // Force logout if we have a mock token still in localStorage
    if (token === 'mock-jwt-token-12345' || (token && !token.includes('.'))) {
      console.warn('Old mock token detected. Clearing session.');
      localStorage.removeItem('token');
      localStorage.removeItem('currentUser');
      return null;
    }
    const data = localStorage.getItem('currentUser');
    return data ? JSON.parse(data) : null;
  }

  get token(): string | null {
    return localStorage.getItem('token');
  }

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  get isLoggedIn(): boolean {
    return !!this.token;
  }

  get isAdmin(): boolean {
    return this.currentUser?.role?.nom === 'ADMIN';
  }

  get isAgent(): boolean {
    return this.currentUser?.role?.nom === 'SUPPORT';
  }

  login(req: AuthRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API}/authenticate`, req).pipe(
      tap(res => {
        if (res.token && res.user) {
          localStorage.setItem('token', res.token);
          localStorage.setItem('currentUser', JSON.stringify(res.user));
          this.currentUserSubject.next(res.user);
        }
      })
    );
  }

  register(req: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API}/register`, req).pipe(
      tap(res => {
        if (res.token && res.user) {
          localStorage.setItem('token', res.token);
          localStorage.setItem('currentUser', JSON.stringify(res.user));
          this.currentUserSubject.next(res.user);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/']);
  }

  updateUser(user: User): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }
}
