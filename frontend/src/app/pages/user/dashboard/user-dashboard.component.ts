import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketService } from '../../../services/ticket.service';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-dashboard.component.html'
})
export class UserDashboardComponent implements OnInit {
  stats: any = null;

  constructor(private ticketService: TicketService) {}

  ngOnInit(): void {
    this.ticketService.getMyTickets().subscribe({
      next: (tickets) => {
        this.stats = {
          totalTickets: tickets.length,
          openTickets: tickets.filter(t => t.statut === 'OUVERT').length,
          inProgressTickets: tickets.filter(t => t.statut === 'EN_COURS').length,
          resolvedTickets: tickets.filter(t => t.statut === 'RESOLU').length
        };
      },
      error: (err) => console.error('Erreur stats user:', err)
    });
  }
}
