import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TicketService } from '../../../services/ticket.service';
import { Ticket } from '../../../models/ticket.model';

@Component({
  selector: 'app-admin-tickets',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="p-8">
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-extrabold text-gray-900 tracking-tight">Gestion des Tickets</h1>
          <p class="text-gray-500 mt-1">Supervisez et gérez toutes les demandes de support du système.</p>
        </div>
      </div>

      <div class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div *ngIf="loading" class="p-12 text-center">
          <div class="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p class="text-gray-500 font-medium">Chargement de tous les tickets...</p>
        </div>

        <div *ngIf="!loading && tickets.length === 0" class="p-16 text-center">
          <div class="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-800 mb-2">Aucun ticket</h3>
          <p class="text-gray-500 max-w-sm mx-auto">Aucun ticket n'a été créé pour le moment par les utilisateurs.</p>
        </div>

        <table *ngIf="!loading && tickets.length > 0" class="w-full">
          <thead>
            <tr class="bg-gray-50 border-b border-gray-100">
              <th class="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Utilisateur</th>
              <th class="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Sujet</th>
              <th class="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Statut</th>
              <th class="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Priorité</th>
              <th class="px-6 py-4 text-left text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr *ngFor="let ticket of tickets" class="hover:bg-gray-50/50 transition-colors">
              <td class="px-6 py-5">
                <div class="font-bold text-gray-900">{{ ticket.userNom }}</div>
                <div class="text-xs text-gray-400 font-medium">{{ ticket.dateCreation | date:'dd/MM/yyyy HH:mm' }}</div>
              </td>
              <td class="px-6 py-5">
                <div class="font-bold text-gray-900">{{ ticket.titre }}</div>
                <div class="text-sm text-gray-500 truncate max-w-xs">{{ ticket.categorieNom || 'Non classé' }}</div>
              </td>
              <td class="px-6 py-5">
                <span [ngClass]="getStatusClass(ticket.statut)" class="px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest border-2">
                  {{ ticket.statut }}
                </span>
              </td>
              <td class="px-6 py-5">
                <span [ngClass]="getPriorityClass(ticket.priorite)" class="flex items-center gap-1.5 text-sm font-bold">
                  <span class="w-2 h-2 rounded-full" [ngClass]="getPriorityDotClass(ticket.priorite)"></span>
                  {{ ticket.priorite }}
                </span>
              </td>
              <td class="px-6 py-5 text-center">
                <div class="flex items-center justify-center gap-2">
                  <button *ngIf="ticket.statut === 'OUVERT'" (click)="updateStatus(ticket.id, 'EN_COURS')" class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors title='Traiter'">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                  <button *ngIf="ticket.statut !== 'RESOLU' && ticket.statut !== 'ARCHIVE'" (click)="updateStatus(ticket.id, 'RESOLU')" class="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors title='Résoudre'">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class AdminTicketsComponent implements OnInit {
  tickets: Ticket[] = [];
  loading = true;

  constructor(private ticketService: TicketService) {}

  ngOnInit(): void {
    this.loadTickets();
  }

  loadTickets(): void {
    this.loading = true;
    this.ticketService.getAllTickets().subscribe({
      next: (res) => {
        console.log('DEBUG [AdminTickets]: Received tickets:', res);
        this.tickets = res;
        this.loading = false;
      },
      error: (err) => {
        console.error('DEBUG [AdminTickets]: Erreur chargement tickets:', err);
        this.loading = false;
      }
    });
  }

  updateStatus(id: number, statut: string): void {
    this.ticketService.updateStatus(id, statut).subscribe({
      next: () => this.loadTickets(),
      error: (err) => console.error('Erreur status update:', err)
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
      default: return 'text-gray-500';
    }
  }

  getPriorityDotClass(priority: string): string {
    switch (priority) {
      case 'CRITIQUE': return 'bg-red-500 animate-pulse';
      case 'HAUTE': return 'bg-orange-500';
      case 'MOYENNE': return 'bg-blue-500';
      default: return 'bg-gray-400';
    }
  }
}
