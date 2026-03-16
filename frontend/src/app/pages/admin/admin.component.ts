import { Component, OnInit } from '@angular/core';
import { AsyncPipe, NgIf, NgFor, CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, AsyncPipe, NgIf, NgFor],
  template: `
    <div class="pt-24 pb-12 px-4 sm:px-8 max-w-7xl mx-auto min-h-screen">
      <header class="mb-12">
        <h1 class="text-3xl font-black text-slate-900">Administration</h1>
        <p class="text-slate-500">Gérez les utilisateurs et les agents de la plateforme.</p>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Stats -->
        <div class="lg:col-span-3 grid grid-cols-1 sm:grid-cols-4 gap-6">
          <div class="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm">
            <span class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 block">Total Utilisateurs</span>
            <span class="text-3xl font-black text-slate-900">1,204</span>
          </div>
          <div class="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm">
            <span class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 block">Agents Actifs</span>
            <span class="text-3xl font-black text-indigo-600">24</span>
          </div>
          <div class="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm">
            <span class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 block">Tickets en attente</span>
            <span class="text-3xl font-black text-rose-500">42</span>
          </div>
          <div class="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm">
            <span class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 block">Satisfaction</span>
            <span class="text-3xl font-black text-emerald-500">98%</span>
          </div>
        </div>

        <!-- Users Table -->
        <div class="lg:col-span-3 bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-sm">
           <div class="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
             <h2 class="text-xl font-bold text-slate-800">Utilisateurs récents</h2>
             <button (click)="loadUsers()" class="text-indigo-600 text-sm font-bold hover:underline">Actualiser</button>
           </div>
           <div class="overflow-x-auto">
             <table class="w-full text-left">
               <thead class="bg-slate-50">
                 <tr>
                   <th class="px-8 py-4 text-[0.65rem] font-bold text-slate-400 uppercase tracking-widest">Utilisateur</th>
                   <th class="px-8 py-4 text-[0.65rem] font-bold text-slate-400 uppercase tracking-widest text-center">Rôle</th>
                   <th class="px-8 py-4 text-[0.65rem] font-bold text-slate-400 uppercase tracking-widest text-center">Statut</th>
                   <th class="px-8 py-4 text-[0.65rem] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                 </tr>
               </thead>
               <tbody *ngIf="users$ | async as users; else loading" class="divide-y divide-slate-100">
                 <tr *ngFor="let u of users" class="hover:bg-slate-50 transition-colors" [class.opacity-40]="!u.estActif">
                   <td class="px-8 py-5">
                     <div class="flex items-center gap-3">
                       <div class="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 text-xs">{{ u.nom.charAt(0) }}</div>
                       <div class="flex flex-col">
                         <span class="text-slate-900 text-sm font-semibold">{{ u.nom }}</span>
                         <span class="text-slate-400 text-xs">{{ u.email }}</span>
                       </div>
                     </div>
                   </td>
                   <td class="px-8 py-5 text-center">
                     <span class="px-3 py-1 rounded-full text-[0.6rem] font-bold border border-slate-200 bg-white text-slate-500 uppercase">
                       {{ u.role }}
                     </span>
                   </td>
                   <td class="px-8 py-5 text-center">
                     <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[0.6rem] font-bold border"
                        [class.bg-emerald-50]="u.estActif" [class.text-emerald-600]="u.estActif" [class.border-emerald-100]="u.estActif"
                        [class.bg-rose-50]="!u.estActif" [class.text-rose-600]="!u.estActif" [class.border-rose-100]="!u.estActif">
                        <span class="w-1.5 h-1.5 rounded-full" [class.bg-emerald-500]="u.estActif" [class.bg-rose-500]="!u.estActif"></span>
                        {{ u.estActif ? 'ACTIF' : 'ARCHIVÉ' }}
                     </span>
                   </td>
                   <td class="px-8 py-5 text-right">
                     <button (click)="toggleUser(u)" 
                        class="px-4 py-2 rounded-xl text-[0.7rem] font-bold transition-all border shadow-sm"
                        [class.bg-white]="u.estActif" [class.text-rose-600]="u.estActif" [class.border-rose-200]="u.estActif" [class.hover:bg-rose-50]="u.estActif"
                        [class.bg-emerald-600]="!u.estActif" [class.text-white]="!u.estActif" [class.border-emerald-600]="!u.estActif" [class.hover:bg-emerald-700]="!u.estActif">
                       {{ u.estActif ? 'Archiver' : 'Désarchiver' }}
                     </button>
                   </td>
                 </tr>
               </tbody>
             </table>
           </div>
        </div>
      </div>
    </div>

    <ng-template #loading>
      <div class="p-20 text-center"><div class="inline-block w-8 h-8 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin"></div></div>
    </ng-template>
ate>
  `,
  styles: []
})
export class AdminComponent implements OnInit {
  users$?: Observable<User[]>;
  constructor(private userService: UserService) {}
  ngOnInit() {
    this.loadUsers();
  }
  loadUsers() {
    this.users$ = this.userService.getAllUsers();
  }
  toggleUser(user: User) {
    if (user.id) {
      this.userService.toggleStatus(user.id).subscribe({
        next: () => this.loadUsers(),
        error: (err: any) => console.error('Erreur', err)
      });
    }
  }
}
