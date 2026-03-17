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
      <header class="flex items-center justify-between mb-12">
        <h1 class="text-3xl font-black text-white">Mes Tickets</h1>
        <a routerLink="/tickets/new" class="btn-primary">
          <span>Nouveau Ticket</span>
        </a>
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
            <tbody *ngIf="tickets$ | async as tickets; else loading" class="divide-y divide-white/5">
              <tr *ngFor="let t of tickets" class="group hover:bg-white/[0.02] transition-colors cursor-pointer" [routerLink]="['/tickets', t.id]">
                <td class="px-8 py-6">
                  <div class="flex flex-col gap-1">
                    <span class="text-white font-bold group-hover:text-primary-light transition-colors">{{ t.titre }}</span>
                    <span class="text-xs text-white/30">#{{ t.id }} • {{ t.categorie }}</span>
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
                    [class.bg-primary/20]="t.statut === 'OUVERT'" [class.text-primary-light]="t.statut === 'OUVERT'">
                    {{ t.statut }}
                  </span>
                </td>
                <td class="px-8 py-6 text-right text-sm text-white/30">
                  {{ t.dateCreation | date:'shortDate' }}
                </td>
              </tr>
              <tr *ngIf="tickets.length === 0">
                <td colspan="4" class="px-8 py-20 text-center text-white/30 font-medium">
                  Aucun ticket trouvé.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <ng-template #loading>
      <div class="p-20 text-center"><div class="inline-block w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div></div>
    </ng-template>
  `,
  styles: []
})
export class TicketsComponent implements OnInit {
  tickets$?: Observable<Ticket[]>;
  constructor(private ticketService: TicketService) {}
  ngOnInit() {
    this.tickets$ = this.ticketService.getMyTickets();
  }
}
