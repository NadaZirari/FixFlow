import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ticket, TicketRequest } from '../models/ticket.model';

@Injectable({ providedIn: 'root' })
export class TicketService {
  private readonly API = 'http://localhost:8080/api/v1/tickets';

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
    return this.http.patch<Ticket>(`${this.API}/${ticketId}/statut`, { statut });
  }

  assignTicket(ticketId: number): Observable<Ticket> {
    return this.http.post<Ticket>(`${this.API}/${ticketId}/assign`, {});
  }

  deleteTicket(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }
}
