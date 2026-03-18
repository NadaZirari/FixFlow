import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { AuthRequest, AuthResponse, RegisterRequest, User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class MockAuthService {
  private currentUser: User | null = null;
  private token = 'mock-jwt-token-12345';

  login(req: AuthRequest): Observable<AuthResponse> {
    if (req.email === 'admin@fixflow.com' && req.motDePasse === 'admin123') {
      const adminUser: User = {
        id: 1,
        nom: 'Admin User',
        email: 'admin@fixflow.com',
        role: { nom: 'ADMIN' },
        estActif: true,
        dateCreation: new Date().toISOString()
      };
      this.currentUser = adminUser;
      return of({ token: this.token, user: adminUser }).pipe(delay(1000));
    }
    
    if (req.email === 'user@fixflow.com' && req.motDePasse === 'user123') {
      const normalUser: User = {
        id: 2,
        nom: 'Normal User',
        email: 'user@fixflow.com',
        role: { nom: 'USER' },
        estActif: true,
        dateCreation: new Date().toISOString()
      };
      this.currentUser = normalUser;
      return of({ token: this.token, user: normalUser }).pipe(delay(1000));
    }
    
    if (req.email === 'support@fixflow.com' && req.motDePasse === 'support123') {
      const supportUser: User = {
        id: 3,
        nom: 'Support Agent',
        email: 'support@fixflow.com',
        role: { nom: 'SUPPORT' },
        estActif: true,
        dateCreation: new Date().toISOString()
      };
      this.currentUser = supportUser;
      return of({ token: this.token, user: supportUser }).pipe(delay(1000));
    }
    
    return throwError(() => new Error('Email ou mot de passe incorrect'));
  }

  register(req: RegisterRequest): Observable<AuthResponse> {
    const newUser: User = {
      id: Math.floor(Math.random() * 1000),
      nom: req.nom,
      email: req.email,
      role: { nom: 'USER' },
      estActif: true,
      dateCreation: new Date().toISOString()
    };
    this.currentUser = newUser;
    return of({ token: this.token, user: newUser }).pipe(delay(1000));
  }

  logout(): void {
    this.currentUser = null;
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  isLoggedIn(): boolean {
    return !!this.currentUser;
  }

  isAdmin(): boolean {
    return this.currentUser?.role?.nom === 'ADMIN';
  }

  isAgent(): boolean {
    return this.currentUser?.role?.nom === 'SUPPORT';
  }
}
