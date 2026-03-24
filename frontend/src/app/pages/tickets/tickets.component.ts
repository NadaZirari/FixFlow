import { Component, OnInit } from '@angular/core';
import { AsyncPipe, NgIf, NgFor, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TicketService } from '../../services/ticket.service';
import { Ticket } from '../../models/ticket.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-tickets',
  standalone: true,
  imports: [AsyncPipe, NgIf, NgFor, DatePipe, RouterLink],
  template: `
    <div class="pt-24 pb-12 px-4 sm:px-8 max-w-7xl mx-auto min-h-screen">
      <header class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <h1 class="text-3xl font-black text-white">Mes Tickets</h1>
        
        <div class="flex items-center gap-4">
          <!-- Status Filter -->
          <div class="relative group">
            <select 
              (change)="onStatusChange($event)"
              class="appearance-none bg-white/10 border border-white/20 text-white py-2 px-6 pr-12 rounded-xl text-xs font-bold cursor-pointer backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            >
              <option value="ALL" class="bg-gray-900">Tous les statuts</option>
              <option value="OUVERT" class="bg-gray-900">🔵 Ouvert</option>
              <option value="EN_COURS" class="bg-gray-900">🟡 En cours</option>
              <option value="RESOLU" class="bg-gray-900">🟢 Résolu</option>
            </select>
            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-white/50">
              <svg class="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
            </div>
          </div>

          <a routerLink="/tickets/new" class="btn-primary">
            <span>Nouveau Ticket</span>
          </a>
        </div>
      </header>

      <div class="bg-white/5 border border-white/10 rounded-[2rem] overflow-hidden backdrop-blur-md">
        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead class="bg-white/[0.03] border-b border-white/10">
              <tr>
                <th class="px-8 py-5 text-xs font-bold text-white/30 uppercase tracking-widest">Ticket</th>
                <th class="px-8 py-5 text-xs font-bold text-white/30 uppercase tracking-widest text-center">Priorité</th>
                <th class="px-8 py-5 text-xs font-bold text-white/30 uppercase tracking-widest text-center">Statut</th>
                <th class="px-8 py-5 text-xs font-bold text-white/30 uppercase tracking-widest text-right">Date</th>
              </tr>
            </thead>
            <tbody *ngIf="!loading; else loadingTpl" class="divide-y divide-white/5">
              <tr *ngFor="let t of filteredTickets" class="group hover:bg-white/[0.02] transition-colors cursor-pointer" [routerLink]="['/tickets', t.id]">
                <td class="px-8 py-6">
                  <div class="flex flex-col gap-1">
                    <span class="text-white font-bold group-hover:text-primary-light transition-colors">{{ t.titre }}</span>
                    <span class="text-xs text-white/30">#{{ t.id }} • {{ t.categorieNom }}</span>
                  </div>
                </td>
                <td class="px-8 py-6 text-center">
                  <span class="px-2.5 py-1 rounded-md text-[0.65rem] font-bold border"
                    [class.bg-red-500/20]="t.priorite === 'HAUTE' || t.priorite === 'CRITIQUE'" 
                    [class.text-red-500]="t.priorite === 'HAUTE' || t.priorite === 'CRITIQUE'"
                    [class.border-red-500/30]="t.priorite === 'HAUTE' || t.priorite === 'CRITIQUE'"
                    [class.bg-yellow-500/20]="t.priorite === 'MOYENNE'" 
                    [class.text-yellow-500]="t.priorite === 'MOYENNE'"
                    [class.border-yellow-500/30]="t.priorite === 'MOYENNE'">
                    {{ t.priorite }}
                  </span>
                </td>
                <td class="px-8 py-6 text-center">
                  <span class="px-3 py-1 rounded-full text-[0.65rem] font-bold border"
                    [class.bg-green-500/20]="t.statut === 'RESOLU'" [class.text-green-500]="t.statut === 'RESOLU'"
                    [class.bg-primary/20]="t.statut === 'OUVERT'" [class.text-primary-light]="t.statut === 'OUVERT'"
                    [class.bg-amber-500/20]="t.statut === 'EN_COURS'" [class.text-amber-500]="t.statut === 'EN_COURS'">
                    {{ t.statut }}
                  </span>
                </td>
                <td class="px-8 py-6 text-right text-sm text-white/30">
                  {{ t.dateCreation | date:'shortDate' }}
                </td>
              </tr>
              <tr *ngIf="filteredTickets.length === 0">
                <td colspan="4" class="px-8 py-20 text-center text-white/30 font-medium">
                  Aucun ticket trouvé.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <ng-template #loadingTpl>
      <div class="p-20 text-center"><div class="inline-block w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div></div>
    </ng-template>
  `,
  styles: []
})
export class TicketsComponent implements OnInit {
  tickets: Ticket[] = [];
  filteredTickets: Ticket[] = [];
  loading = true;
  selectedStatus = 'ALL';

  constructor(private ticketService: TicketService) {}

  ngOnInit() {
    this.loadTickets();
  }

  loadTickets() {
    this.loading = true;
    this.ticketService.getMyTickets().subscribe({
      next: (res) => {
        this.tickets = res;
        this.applyFilter();
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur chargement tickets:', err);
        this.loading = false;
      }
    });
  }

  onStatusChange(event: any) {
    this.selectedStatus = event.target.value;
    this.applyFilter();
  }

  applyFilter() {
    if (this.selectedStatus === 'ALL') {
      this.filteredTickets = this.tickets;
    } else {
      this.filteredTickets = this.tickets.filter(t => t.statut === this.selectedStatus);
    }
  }
}
