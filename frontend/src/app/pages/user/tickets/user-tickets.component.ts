import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TicketService } from '../../../services/ticket.service';
import { Ticket } from '../../../models/ticket.model';

@Component({
  selector: 'app-user-tickets',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './user-tickets.component.html',
  styles: []
})
export class UserTicketsComponent implements OnInit {
  tickets: Ticket[] = [];
  filteredTickets: Ticket[] = [];
  loading = true;
  searchQuery = '';
  selectedStatus = 'ALL';

  // Pagination state
  currentPage = 0;
  pageSize = 4;
  totalElements = 0;
  totalPages = 0;

  constructor(private ticketService: TicketService, private router: Router) {}

  navigateToEdit(id?: number): void {
    if (id) {
      this.router.navigate(['/user/tickets', id], { queryParams: { edit: 'true' } });
    }
  }

  ngOnInit(): void {
    this.loadTickets();
  }

  loadTickets(): void {
    this.loading = true;
    this.ticketService.getMyTicketsPaged(this.currentPage, this.pageSize).subscribe({
      next: (res) => {
        this.tickets = res.content;
        this.totalElements = res.totalElements;
        this.totalPages = res.totalPages;
        this.applyFilter();
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Erreur chargement tickets:', err);
        this.loading = false;
      }
    });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadTickets();
  }

  onStatusChange(event: any): void {
    this.selectedStatus = event.target.value;
    this.applyFilter();
  }

  applyFilter(): void {
    const query = this.searchQuery.toLowerCase().trim();
    this.filteredTickets = this.tickets.filter(t => {
      const matchQuery = !query || 
        t.titre?.toLowerCase().includes(query) || 
        t.description?.toLowerCase().includes(query) ||
        t.id?.toString().includes(query);
      
      const matchStatus = this.selectedStatus === 'ALL' || t.statut === this.selectedStatus;
      
      return matchQuery && matchStatus;
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'OUVERT': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'EN_COURS': return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'RESOLU': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'ARCHIVE': return 'bg-gray-50 text-gray-700 border-gray-100';
      default: return 'bg-gray-50 text-gray-700 border-gray-100';
    }
  }

  getPriorityClass(priority: string): string {
    switch (priority) {
      case 'CRITIQUE': return 'text-red-700';
      case 'HAUTE': return 'text-orange-600';
      case 'MOYENNE': return 'text-blue-600';
      default: return 'text-gray-400';
    }
  }

  getPriorityDotClass(priority: string): string {
    switch (priority) {
      case 'CRITIQUE': return 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)] animate-pulse';
      case 'HAUTE': return 'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]';
      case 'MOYENNE': return 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]';
      default: return 'bg-gray-300';
    }
  }
}
