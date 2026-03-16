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
        <h1 class="text-3xl font-black text-slate-900">Mes Tickets</h1>
        <a routerLink="/tickets/new" class="btn-primary">
          <span>Nouveau Ticket</span>
        </a>
      </header>

      <div class="bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-sm">
        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead class="bg-slate-50 border-b border-slate-100">
              <tr>
                <th class="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Ticket</th>
                <th class="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Priorité</th>
                <th class="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Statut</th>
                <th class="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Date</th>
              </tr>
            </thead>
            <tbody *ngIf="tickets$ | async as tickets; else loading" class="divide-y divide-slate-100">
              <tr *ngFor="let t of tickets" class="group hover:bg-slate-50 transition-colors cursor-pointer" [routerLink]="['/tickets', t.id]">
                <td class="px-8 py-6">
                  <div class="flex flex-col gap-1">
                    <span class="text-slate-900 font-bold group-hover:text-indigo-600 transition-colors">{{ t.titre }}</span>
                    <span class="text-xs text-slate-400">#{{ t.id }} • {{ t.categorie }}</span>
                  </div>
                </td>
                <td class="px-8 py-6 text-center">
                  <span class="px-3 py-1 rounded-full text-[0.65rem] font-bold border"
                    [class.bg-rose-50]="t.priorite === 'HAUTE' || t.priorite === 'CRITIQUE'" 
                    [class.text-rose-600]="t.priorite === 'HAUTE' || t.priorite === 'CRITIQUE'"
                    [class.border-rose-100]="t.priorite === 'HAUTE' || t.priorite === 'CRITIQUE'"
                    [class.bg-amber-50]="t.priorite === 'MOYENNE'" 
                    [class.text-amber-600]="t.priorite === 'MOYENNE'"
                    [class.border-amber-100]="t.priorite === 'MOYENNE'"
                    [class.bg-slate-50]="t.priorite === 'FAIBLE'"
                    [class.text-slate-500]="t.priorite === 'FAIBLE'"
                    [class.border-slate-200]="t.priorite === 'FAIBLE'">
                    {{ t.priorite }}
                  </span>
                </td>
                <td class="px-8 py-6 text-center">
                  <span class="px-3 py-1 rounded-full text-[0.65rem] font-bold border"
                    [class.bg-emerald-50]="t.statut === 'RESOLU'" [class.text-emerald-600]="t.statut === 'RESOLU'" [class.border-emerald-100]="t.statut === 'RESOLU'"
                    [class.bg-indigo-50]="t.statut === 'OUVERT'" [class.text-indigo-600]="t.statut === 'OUVERT'" [class.border-indigo-100]="t.statut === 'OUVERT'">
                    {{ t.statut }}
                  </span>
                </td>
                <td class="px-8 py-6 text-right text-sm text-slate-400">
                  {{ t.dateCreation | date:'shortDate' }}
                </td>
              </tr>
              <tr *ngIf="tickets.length === 0">
                <td colspan="4" class="px-8 py-24 text-center text-slate-400 font-medium">
                  <div class="text-4xl mb-4">🎫</div>
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
