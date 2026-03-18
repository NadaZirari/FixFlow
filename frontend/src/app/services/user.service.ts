import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

export interface CreateUserRequest {
  nom: string;
  email: string;
  motDePasse: string;
  role: { nom: string };
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly API = 'http://localhost:8081/api/v1/users';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getAll(): Observable<User[]> {
    return this.http.get<User[]>(this.API, { headers: this.getHeaders() });
  }

  getById(id: number): Observable<User> {
    return this.http.get<User>(`${this.API}/${id}`, { headers: this.getHeaders() });
  }

  create(user: CreateUserRequest): Observable<User> {
    return this.http.post<User>(this.API, user, { headers: this.getHeaders() });
  }

  update(id: number, user: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.API}/${id}`, user, { headers: this.getHeaders() });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`, { headers: this.getHeaders() });
  }

  toggleStatus(id: number): Observable<User> {
    return this.http.patch<User>(`${this.API}/${id}/toggle-status`, {}, { headers: this.getHeaders() });
  }
}
