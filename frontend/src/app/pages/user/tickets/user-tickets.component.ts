import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TicketService } from '../../../services/ticket.service';
import { Ticket } from '../../../models/ticket.model';

@Component({
  selector: 'app-user-tickets',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="p-8">
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-extrabold text-gray-900 tracking-tight">Mes Tickets</h1>
          <p class="text-gray-500 mt-1">Gérez et suivez l'état de vos demandes de support.</p>
        </div>
        <button routerLink="/user/tickets/new" 
          class="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
          </svg>
          Nouveau Ticket
        </button>
      </div>

      <div class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div *ngIf="loading" class="p-12 text-center">
          <div class="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p class="text-gray-500 font-medium">Chargement de vos tickets...</p>
        </div>

        <div *ngIf="!loading && tickets.length === 0" class="p-16 text-center">
          <div class="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-800 mb-2">Aucun ticket trouvé</h3>
          <p class="text-gray-500 max-w-sm mx-auto mb-8">Vous n'avez pas encore créé de ticket. Si vous rencontrez un problème, créez votre première demande.</p>
          <button routerLink="/user/tickets/new" class="text-blue-600 font-bold hover:underline">Créer mon premier ticket &rarr;</button>
        </div>

        <table *ngIf="!loading && tickets.length > 0" class="w-full">
          <thead>
            <tr class="bg-gray-50 border-b border-gray-100">
              <th class="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Ticket</th>
              <th class="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Catégorie</th>
              <th class="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Statut</th>
              <th class="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Priorité</th>
              <th class="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr *ngFor="let ticket of tickets" class="hover:bg-gray-50/50 transition-colors">
              <td class="px-6 py-5">
                <div class="font-bold text-gray-900">{{ ticket.titre }}</div>
                <div class="text-sm text-gray-500 truncate max-w-xs">{{ ticket.description }}</div>
              </td>
              <td class="px-6 py-5">
                <span class="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-bold">
                  {{ ticket.categorieNom || 'Non classé' }}
                </span>
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
              <td class="px-6 py-5 text-sm text-gray-400 font-medium whitespace-nowrap">
                {{ ticket.dateCreation | date:'dd MMM yyyy' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class UserTicketsComponent implements OnInit {
  tickets: Ticket[] = [];
  loading = true;

  constructor(private ticketService: TicketService) {}

  ngOnInit(): void {
    this.loadTickets();
  }

  loadTickets(): void {
    this.loading = true;
    this.ticketService.getMyTickets().subscribe({
      next: (res) => {
        console.log('DEBUG [UserTickets]: Received tickets:', res);
        this.tickets = res;
        this.loading = false;
      },
      error: (err) => {
        console.error('DEBUG [UserTickets]: Erreur chargement tickets:', err);
        this.loading = false;
      }
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
