import { Component, OnInit } from '@angular/core';
import { AsyncPipe, NgIf, NgFor, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TicketService } from '../../services/ticket.service';
import { Ticket } from '../../models/ticket.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [AsyncPipe, NgIf, NgFor, DatePipe, RouterLink],
  template: `
    <div class="pt-24 pb-12 px-4 sm:px-8 max-w-7xl mx-auto min-h-screen">
      <header class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 class="text-3xl font-black text-slate-900 mb-2">Tableau de bord</h1>
          <p class="text-slate-500">Bienvenue, {{ (authService.currentUser$ | async)?.nom }} 👋</p>
        </div>
        <a routerLink="/tickets/new" class="btn-primary">
          <span>Ouvrir un ticket</span>
        </a>
      </header>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div class="bg-white border border-slate-200 p-8 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
          <span class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Tickets Ouverts</span>
          <span class="text-4xl font-black text-slate-900">3</span>
        </div>
        <div class="bg-white border border-slate-200 p-8 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
          <span class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">En cours</span>
          <span class="text-4xl font-black text-indigo-600">2</span>
        </div>
        <div class="bg-white border border-slate-200 p-8 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
          <span class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Résolus</span>
          <span class="text-4xl font-black text-emerald-500">12</span>
        </div>
      </div>

      <section>
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold text-slate-800">Activités récentes</h2>
          <a routerLink="/tickets" class="text-indigo-600 text-sm font-semibold hover:underline">Voir tout</a>
        </div>
        
        <div class="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
          <div *ngIf="tickets$ | async as tickets; else loading" class="divide-y divide-slate-100">
            <div *ngFor="let t of tickets.slice(0, 5)" class="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div class="flex flex-col gap-1">
                <span class="text-slate-900 font-bold">{{ t.titre }}</span>
                <span class="text-xs text-slate-400">{{ t.dateCreation | date:'medium' }} • {{ t.categorie }}</span>
              </div>
              <div class="flex items-center gap-4">
                <span class="px-3 py-1 rounded-full text-[0.65rem] font-bold border" 
                  [class.bg-emerald-50]="t.statut === 'RESOLU'" [class.text-emerald-600]="t.statut === 'RESOLU'" [class.border-emerald-100]="t.statut === 'RESOLU'"
                  [class.bg-indigo-50]="t.statut === 'OUVERT'" [class.text-indigo-600]="t.statut === 'OUVERT'" [class.border-indigo-100]="t.statut === 'OUVERT'">
                  {{ t.statut }}
                </span>
                <a [routerLink]="['/tickets', t.id]" class="text-slate-300 hover:text-slate-900 transition-colors">
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
                </a>
              </div>
            </div>
            <div *ngIf="tickets.length === 0" class="p-20 text-center text-slate-400 text-sm">
              <div class="text-4xl mb-4">🎫</div>
              Vous n'avez pas encore de tickets.
            </div>
          </div>
          <ng-template #loading>
            <div class="p-20 text-center"><div class="inline-block w-8 h-8 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div></div>
          </ng-template>
        </div>
      </section>
    </div>
  `,
  styles: []
})
export class DashboardComponent implements OnInit {
  tickets$?: Observable<Ticket[]>;
  constructor(public authService: AuthService, private ticketService: TicketService) {}
  ngOnInit() {
    this.tickets$ = this.ticketService.getMyTickets();
  }
}
