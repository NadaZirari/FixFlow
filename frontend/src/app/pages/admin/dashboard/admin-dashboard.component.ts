import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketService } from '../../../services/ticket.service';
import { UserService } from '../../../services/user.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.component.html'
})
export class AdminDashboardComponent implements OnInit {
  stats: any = null;

  constructor(
    private ticketService: TicketService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    forkJoin({
      tickets: this.ticketService.getAllTickets(),
      users: this.userService.getAll(),
      categories: this.ticketService.getCategories()
    }).subscribe({
      next: (data) => {
        this.stats = {
          totalTickets: data.tickets.length,
          openTickets: data.tickets.filter(t => t.statut === 'OUVERT').length,
          inProgressTickets: data.tickets.filter(t => t.statut === 'EN_COURS').length,
          resolvedTickets: data.tickets.filter(t => t.statut === 'RESOLU').length,
          totalUsers: data.users.length,
          totalCategories: data.categories.length
        };
      },
      error: (err) => console.error('Erreur stats admin:', err)
    });
  }
}
