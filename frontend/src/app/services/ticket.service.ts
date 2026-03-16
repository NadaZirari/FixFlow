import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ticket, TicketRequest } from '../models/ticket.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TicketService {
  private readonly API = `${environment.apiUrl}/tickets`;

  constructor(private http: HttpClient) {}

  getMyTickets(): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(`${this.API}/my`);
  }

  getTicketById(id: number): Observable<Ticket> {
    return this.http.get<Ticket>(`${this.API}/${id}`);
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
}
