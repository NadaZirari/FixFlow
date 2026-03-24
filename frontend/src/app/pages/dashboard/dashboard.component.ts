import { Component, OnInit } from '@angular/core';
import { AsyncPipe, NgIf, NgFor, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TicketService } from '../../services/ticket.service';
import { Ticket } from '../../models/ticket.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [AsyncPipe, NgIf, NgFor, DatePipe, RouterLink],
  templateUrl: './dashboard.component.html',
  styles: []
})
export class DashboardComponent implements OnInit {
  tickets$?: Observable<Ticket[]>;
  constructor(public authService: AuthService, private ticketService: TicketService) {}
  ngOnInit() {
    this.tickets$ = this.ticketService.getMyTickets();
  }
}
