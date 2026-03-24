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
    <div class="p-4 sm:p-8 max-w-7xl mx-auto min-h-screen">
      <!-- Premium Header & Stats Section -->
      <header class="mb-10">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div class="space-y-1">
            <h1 class="text-3xl font-black text-gray-900 tracking-tight">Gestion des Tickets</h1>
            <p class="text-gray-500 font-medium">Supervisez et résolvez les demandes de vos utilisateurs.</p>
          </div>
          
          <div class="flex items-center gap-2 bg-gray-50/50 p-1.5 rounded-[2rem] border border-gray-100">
            <div class="relative group">
              <select 
                (change)="onPriorityFilterChange($event)"
                class="appearance-none bg-white border border-gray-100 text-gray-900 py-2.5 px-6 pr-12 rounded-2xl font-black text-xs cursor-pointer shadow-sm hover:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all"
              >
                <option value="ALL">Priorité: Toutes</option>
                <option value="FAIBLE">🚀 Faible</option>
                <option value="MOYENNE">⚡ Moyenne</option>
                <option value="HAUTE">🔥 Haute</option>
                <option value="CRITIQUE">🚨 Critique</option>
              </select>
              <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400 group-hover:text-blue-500 transition-colors">
                <svg class="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
              </div>
            </div>

            <div class="relative group">
              <select 
                (change)="onStatusFilterChange($event)"
                class="appearance-none bg-white border border-gray-100 text-gray-900 py-2.5 px-6 pr-12 rounded-2xl font-black text-xs cursor-pointer shadow-sm hover:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-100 transition-all"
              >
                <option value="ALL">Statut: Tous</option>
                <option value="OUVERT">🔵 Ouvert</option>
                <option value="EN_COURS">🟡 En cours</option>
                <option value="RESOLU">🟢 Résolu</option>
                <option value="ARCHIVE">🔘 Archivé</option>
              </select>
              <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400 group-hover:text-emerald-500 transition-colors">
                <svg class="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Stats Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-100/50 flex flex-col gap-4">
            <div class="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <div class="text-3xl font-black text-gray-900">{{ tickets.length }}</div>
              <div class="text-xs font-black text-gray-400 uppercase tracking-widest">Tickets Totaux</div>
            </div>
          </div>

          <div class="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-100/50 flex flex-col gap-4">
            <div class="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <div class="text-3xl font-black text-gray-900">{{ getOpenCount() }}</div>
              <div class="text-xs font-black text-gray-400 uppercase tracking-widest">En Attente / Cours</div>
            </div>
          </div>

          <div class="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-100/50 flex flex-col gap-4">
            <div class="w-10 h-10 bg-red-50 text-red-600 rounded-xl flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <div class="text-3xl font-black text-gray-900 font-mono">{{ getCriticalCount() }}</div>
              <div class="text-xs font-black text-gray-400 uppercase tracking-widest">Priorité Critique</div>
            </div>
          </div>

          <div class="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-100/50 flex flex-col gap-4">
            <div class="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <div class="text-3xl font-black text-gray-900">{{ getResolvedCount() }}</div>
              <div class="text-xs font-black text-gray-400 uppercase tracking-widest">Résolus</div>
            </div>
          </div>
        </div>
      </header>

      <!-- Modern Tickets Table Section -->
      <div class="bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200 border border-gray-100 overflow-hidden">
        <div *ngIf="loading" class="p-20 text-center">
          <div class="relative inline-block">
            <div class="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
            <div class="absolute inset-0 flex items-center justify-center">
              <div class="w-2 h-2 bg-blue-600 rounded-full animate-ping"></div>
            </div>
          </div>
          <p class="mt-6 text-gray-400 font-bold uppercase tracking-widest text-xs">Extraction des requêtes...</p>
        </div>

        <div *ngIf="!loading && filteredTickets.length === 0" class="p-24 text-center">
          <div class="bg-gray-50 w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 class="text-xl font-black text-gray-900 mb-2">Aucun résultat</h3>
          <p class="text-gray-400 font-medium max-w-xs mx-auto text-sm">Nous n'avons trouvé aucun ticket correspondant à vos filtres actuels.</p>
        </div>

        <div class="overflow-x-auto" *ngIf="!loading && filteredTickets.length > 0">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-gray-50/50 border-b border-gray-50">
                <th class="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Utilisateur</th>
                <th class="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Demande</th>
                <th class="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest text-center">Statut</th>
                <th class="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Priorité</th>
                <th class="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              <tr *ngFor="let ticket of filteredTickets" class="group hover:bg-blue-50/30 transition-all duration-300">
                <td class="px-8 py-6">
                  <div class="flex items-center gap-4">
                    <div class="w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-black shadow-inner"
                         [style.background-color]="getAvatarBg(ticket.userNom)"
                         [style.color]="getAvatarColor(ticket.userNom)">
                      {{ getInitials(ticket.userNom) }}
                    </div>
                    <div class="flex flex-col">
                      <span class="text-gray-900 font-black tracking-tight group-hover:text-blue-600 transition-colors">{{ ticket.userNom }}</span>
                      <span class="text-gray-400 text-[0.65rem] font-bold uppercase tracking-tighter">{{ ticket.dateCreation | date:'dd MMM yyyy • HH:mm' }}</span>
                    </div>
                  </div>
                </td>
                <td class="px-8 py-6">
                  <div class="flex flex-col gap-1 max-w-md">
                    <div class="flex items-center gap-2">
                      <span class="text-gray-900 font-black tracking-tight line-clamp-1">{{ ticket.titre }}</span>
                      <a *ngIf="ticket.cheminFichier" 
                        [href]="'http://localhost:8081/uploads/' + ticket.cheminFichier" 
                        target="_blank"
                        class="p-1 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all active:scale-90"
                        title="Voir la pièce jointe">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                        </svg>
                      </a>
                    </div>
                    <span class="text-xs font-bold text-gray-400 uppercase tracking-widest">{{ ticket.categorieNom || 'Non classé' }}</span>
                  </div>
                </td>
                <td class="px-8 py-6 text-center">
                  <div class="flex items-center justify-center">
                    <span [ngClass]="getStatusClass(ticket.statut)" class="px-3 py-1 text-[0.6rem] font-black rounded-lg border uppercase tracking-widest">
                      {{ ticket.statut }}
                    </span>
                  </div>
                </td>
                <td class="px-8 py-6">
                  <div [ngClass]="getPriorityClass(ticket.priorite)" class="flex items-center gap-2 font-black text-[0.65rem] uppercase tracking-widest">
                    <div class="w-1.5 h-1.5 rounded-full" [ngClass]="getPriorityDotClass(ticket.priorite)"></div>
                    {{ ticket.priorite }}
                  </div>
                </td>
                <td class="px-8 py-6 text-right">
                  <button [routerLink]="['/admin/tickets', ticket.id]" 
                    class="p-3 bg-gray-50 text-gray-400 hover:bg-blue-600 hover:text-white hover:shadow-lg hover:shadow-blue-200 rounded-2xl transition-all active:scale-90 group/btn">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 transform group-hover/btn:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class AdminTicketsComponent implements OnInit {
  tickets: Ticket[] = [];
  filteredTickets: Ticket[] = [];
  loading = true;
  selectedPriority = 'ALL';
  selectedStatus = 'ALL';

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

  onPriorityFilterChange(event: any): void {
    this.selectedPriority = event.target.value;
    this.applyFilter();
  }

  onStatusFilterChange(event: any): void {
    this.selectedStatus = event.target.value;
    this.applyFilter();
  }

  applyFilter(): void {
    this.filteredTickets = this.tickets.filter(t => {
      const matchPriority = this.selectedPriority === 'ALL' || t.priorite === this.selectedPriority;
      const matchStatus = this.selectedStatus === 'ALL' || t.statut === this.selectedStatus;
      return matchPriority && matchStatus;
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
