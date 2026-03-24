import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TicketService } from '../../../services/ticket.service';
import { Ticket } from '../../../models/ticket.model';

@Component({
  selector: 'app-admin-tickets',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './admin-tickets.component.html'
})
export class AdminTicketsComponent implements OnInit {
  tickets: Ticket[] = [];
  filteredTickets: Ticket[] = [];
  loading = true;
  selectedPriority = 'ALL';
  selectedStatus = 'ALL';
  searchQuery = '';

  constructor(private ticketService: TicketService) {}

  ngOnInit(): void {
    this.loadTickets();
  }

  getInitials(name: string): string {
    if (!name) return '??';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  }

  getAvatarBg(name: string): string {
    const colors = ['#eff6ff', '#f5f3ff', '#fdf2f8', '#ecfdf5', '#fff7ed', '#fef2f2'];
    let hash = 0;
    for (let i = 0; i < (name?.length || 0); i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
  }

  getAvatarColor(name: string): string {
    const colors = ['#2563eb', '#7c3aed', '#db2777', '#059669', '#ea580c', '#dc2626'];
    let hash = 0;
    for (let i = 0; i < (name?.length || 0); i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
  }

  getOpenCount(): number {
    return this.tickets.filter(t => t.statut === 'OUVERT' || t.statut === 'EN_COURS').length;
  }

  getCriticalCount(): number {
    return this.tickets.filter(t => t.priorite === 'CRITIQUE').length;
  }

  getResolvedCount(): number {
    return this.tickets.filter(t => t.statut === 'RESOLU').length;
  }

  loadTickets(): void {
    this.loading = true;
    this.ticketService.getAllTickets().subscribe({
      next: (res: any) => {
        this.tickets = res;
        this.applyFilter();
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Erreur chargement tickets:', err);
        this.loading = false;
      }
    });
  }

  onPriorityFilterChange(event: any): void {
    this.selectedPriority = event.target.value;
    this.applyFilter();
  }

  onStatusFilterChange(event: any): void {
    this.selectedStatus = event.target.value;
    this.applyFilter();
  }

  applyFilter(): void {
    const query = this.searchQuery.toLowerCase().trim();
    this.filteredTickets = this.tickets.filter(t => {
      const matchQuery = !query || 
        t.titre?.toLowerCase().includes(query) || 
        t.description?.toLowerCase().includes(query) || 
        t.userNom?.toLowerCase().includes(query) ||
        t.id?.toString().includes(query);
      
      const matchPriority = this.selectedPriority === 'ALL' || t.priorite === this.selectedPriority;
      const matchStatus = this.selectedStatus === 'ALL' || t.statut === this.selectedStatus;
      
      return matchQuery && matchPriority && matchStatus;
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
