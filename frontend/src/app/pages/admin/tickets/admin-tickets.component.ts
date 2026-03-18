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
                <div class="flex items-center gap-2">
                  <div class="font-bold text-gray-900">{{ ticket.titre }}</div>
                  <a *ngIf="ticket.cheminFichier" 
                     [href]="'http://localhost:8081/uploads/' + ticket.cheminFichier" 
                     target="_blank"
                     class="text-blue-500 hover:text-blue-700 transition-colors"
                     title="Voir la pièce jointe"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                  </a>
                </div>
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
                <button [routerLink]="['/admin/tickets', ticket.id]" class="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" title="Consulter">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
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
        this.tickets = res;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur chargement tickets:', err);
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
