import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ticket, TicketRequest } from '../models/ticket.model';

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
  private API = 'http://localhost:8081/api/v1/tickets';

  constructor(private http: HttpClient) {}

  getAllTickets(): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(this.API);
  }

  getMyTickets(): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(`${this.API}/my`);
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
    return this.http.get<Categorie[]>('http://localhost:8081/api/v1/categories');
  }

  getComments(ticketId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`http://localhost:8081/api/v1/commentaires/ticket/${ticketId}`);
  }

  addComment(ticketId: number, content: string): Observable<Comment> {
    return this.http.post<Comment>(`http://localhost:8081/api/v1/commentaires/ticket/${ticketId}`, { contenu: content });
  }
}
