import { Component, OnInit } from '@angular/core';
import { AsyncPipe, NgIf, NgFor } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { User } from '../../models/user.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [AsyncPipe, NgIf, NgFor],
  template: `
    <div class="pt-24 pb-12 px-4 sm:px-8 max-w-7xl mx-auto min-h-screen">
      <header class="mb-12">
        <h1 class="text-3xl font-black text-white">Administration</h1>
        <p class="text-white/50">Gérez les utilisateurs et les agents de la plateforme.</p>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Stats -->
        <div class="lg:col-span-3 grid grid-cols-1 sm:grid-cols-4 gap-6">
          <div class="bg-white/5 border border-white/10 p-6 rounded-3xl">
            <span class="text-xs font-bold text-white/30 uppercase tracking-widest mb-1 block">Total Utilisateurs</span>
            <span class="text-3xl font-black text-white">1,204</span>
          </div>
          <div class="bg-white/5 border border-white/10 p-6 rounded-3xl">
            <span class="text-xs font-bold text-white/30 uppercase tracking-widest mb-1 block">Agents Actifs</span>
            <span class="text-3xl font-black text-secondary">24</span>
          </div>
          <div class="bg-white/5 border border-white/10 p-6 rounded-3xl">
            <span class="text-xs font-bold text-white/30 uppercase tracking-widest mb-1 block">Tickets en attente</span>
            <span class="text-3xl font-black text-accent">42</span>
          </div>
          <div class="bg-white/5 border border-white/10 p-6 rounded-3xl">
            <span class="text-xs font-bold text-white/30 uppercase tracking-widest mb-1 block">Satisfaction</span>
            <span class="text-3xl font-black text-green-500">98%</span>
          </div>
        </div>

        <!-- Users Table -->
        <div class="lg:col-span-3 bg-white/5 border border-white/10 rounded-[2rem] overflow-hidden backdrop-blur-md">
           <div class="px-8 py-6 border-b border-white/10 flex items-center justify-between">
             <h2 class="text-xl font-bold text-white">Utilisateurs récents</h2>
             <button class="text-primary-light text-sm font-bold hover:underline">Voir tous les utilisateurs</button>
           </div>
           <div class="overflow-x-auto">
             <table class="w-full text-left">
               <thead class="bg-white/[0.03]">
                 <tr>
                   <th class="px-8 py-4 text-[0.65rem] font-bold text-white/30 uppercase tracking-widest">Utilisateur</th>
                   <th class="px-8 py-4 text-[0.65rem] font-bold text-white/30 uppercase tracking-widest text-center">Rôle</th>
                   <th class="px-8 py-4 text-[0.65rem] font-bold text-white/30 uppercase tracking-widest text-center">Statut</th>
                   <th class="px-8 py-4 text-[0.65rem] font-bold text-white/30 uppercase tracking-widest text-right">Actions</th>
                 </tr>
               </thead>
               <tbody *ngIf="users$ | async as users; else loading" class="divide-y divide-white/5">
                 <tr *ngFor="let u of users.slice(0, 10)" class="hover:bg-white/[0.02] transition-colors">
                   <td class="px-8 py-5">
                     <div class="flex items-center gap-3">
                       <div class="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary-light text-xs">{{ u.nom.charAt(0) }}</div>
                       <div class="flex flex-col">
                         <span class="text-white text-sm font-semibold">{{ u.nom }}</span>
                         <span class="text-[0.7rem] text-white/30">{{ u.email }}</span>
                       </div>
                     </div>
                   </td>
                   <td class="px-8 py-5 text-center">
                     <span class="px-2 py-0.5 rounded-md text-[0.6rem] font-bold border border-white/10 text-white/50 uppercase">
                       {{ u.role }}
                     </span>
                   </td>
                   <td class="px-8 py-5 text-center">
                     <span class="inline-flex w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                   </td>
                   <td class="px-8 py-5 text-right">
                     <button class="text-white/20 hover:text-white transition-colors">
                       <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="18" height="18"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
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
      <div class="p-20 text-center"><div class="inline-block w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div></div>
    </ng-template>
  `,
  styles: []
})
export class AdminComponent implements OnInit {
  users$?: Observable<User[]>;
  constructor(private http: HttpClient) {}
  ngOnInit() {
    this.users$ = this.http.get<User[]>('http://localhost:8080/api/v1/users');
  }
}
