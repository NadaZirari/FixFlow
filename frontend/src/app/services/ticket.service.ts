import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ticket, TicketRequest, PagedResponse } from '../models/ticket.model';

export type { Ticket, TicketRequest };

export interface Categorie {
  id: number;
  nom: string;
  description: string;
}

export interface Comment {
  id: number;
  contenu: string;
  date: string;
  auteurNom: string;
}

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private API = '/api/v1/tickets';

  constructor(private http: HttpClient) {}

  getAllTickets(): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(this.API);
  }

  getTicketsPaged(page: number, size: number): Observable<PagedResponse<Ticket>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<PagedResponse<Ticket>>(`${this.API}/paged`, { params });
  }

  getMyTickets(): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(`${this.API}/my`);
  }

  getMyTicketsPaged(page: number, size: number): Observable<PagedResponse<Ticket>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<PagedResponse<Ticket>>(`${this.API}/my/paged`, { params });
  }

  getById(id: number): Observable<Ticket> {
    return this.http.get<Ticket>(`${this.API}/${id}`);
  }

  createTicket(req: TicketRequest, file: File | null = null): Observable<Ticket> {
    if (!file) {
      return this.http.post<Ticket>(this.API, req);
    }

    const formData = new FormData();
    const ticketBlob = new Blob([JSON.stringify(req)], { type: 'application/json' });
    formData.append('ticket', ticketBlob);
    formData.append('file', file);

    return this.http.post<Ticket>(this.API, formData);
  }

  updateTicket(id: number, req: TicketRequest): Observable<Ticket> {
    return this.http.put<Ticket>(`${this.API}/${id}`, req);
  }

  updateStatus(id: number, status: string): Observable<Ticket> {
    return this.http.put<Ticket>(`${this.API}/${id}/status`, null, {
      params: { statut: status }
    });
  }

  getCategories(): Observable<Categorie[]> {
    return this.http.get<Categorie[]>('/api/v1/categories');
  }

  createCategory(categorie: { nom: string; description?: string }): Observable<Categorie> {
    return this.http.post<Categorie>('/api/v1/categories', categorie);
  }

  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`/api/v1/categories/${id}`);
  }

  getComments(ticketId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`/api/v1/commentaires/ticket/${ticketId}`);
  }

  addComment(ticketId: number, content: string): Observable<Comment> {
    return this.http.post<Comment>(`/api/v1/commentaires/ticket/${ticketId}`, { contenu: content });
  }
}
