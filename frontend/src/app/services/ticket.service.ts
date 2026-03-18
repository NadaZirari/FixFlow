import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ticket, TicketRequest } from '../models/ticket.model';

export interface Categorie {
  id: number;
  nom: string;
}

export interface Comment {
  id: number;
  contenu: string;
  date: string;
  auteurNom: string;
}

@Injectable({ providedIn: 'root' })
export class TicketService {
  private readonly API = 'http://localhost:8081/api/v1/tickets';

  constructor(private http: HttpClient) {}

  getMyTickets(): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(`${this.API}/my`);
  }

  getAllTickets(): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(this.API);
  }

  createTicket(req: TicketRequest): Observable<Ticket> {
    return this.http.post<Ticket>(this.API, req);
  }

  updateTicket(id: number, req: TicketRequest): Observable<Ticket> {
    return this.http.put<Ticket>(`${this.API}/${id}`, req);
  }

  updateStatus(ticketId: number, statut: string): Observable<Ticket> {
    return this.http.put<Ticket>(`${this.API}/${ticketId}/status`, {}, {
      params: { statut }
    });
  }

  assignTicket(ticketId: number): Observable<Ticket> {
    return this.http.post<Ticket>(`${this.API}/${ticketId}/assign`, {});
  }

  deleteTicket(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }

  getById(id: number): Observable<Ticket> {
    return this.http.get<Ticket>(`${this.API}/${id}`);
  }

  getComments(ticketId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`http://localhost:8081/api/v1/commentaires/ticket/${ticketId}`);
  }

  addComment(ticketId: number, contenu: string): Observable<Comment> {
    return this.http.post<Comment>(`http://localhost:8081/api/v1/commentaires/ticket/${ticketId}`, { contenu });
  }

  getCategories(): Observable<Categorie[]> {
    return this.http.get<Categorie[]>('http://localhost:8081/api/v1/categories');
  }
}
