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
             <button (click)="loadUsers()" class="text-primary-light text-sm font-bold hover:underline">Actualiser</button>
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
                 <tr *ngFor="let u of users" class="hover:bg-white/[0.02] transition-colors" [class.opacity-40]="!u.estActif">
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
                     <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[0.6rem] font-bold border"
                        [class.bg-green-500/10]="u.estActif" [class.text-green-400]="u.estActif" [class.border-green-500/20]="u.estActif"
                        [class.bg-red-500/10]="!u.estActif" [class.text-red-400]="!u.estActif" [class.border-red-500/20]="!u.estActif">
                        <span class="w-1 h-1 rounded-full" [class.bg-green-400]="u.estActif" [class.bg-red-400]="!u.estActif"></span>
                        {{ u.estActif ? 'ACTIF' : 'ARCHIVÉ' }}
                     </span>
                   </td>
                   <td class="px-8 py-5 text-right">
                     <button (click)="toggleUser(u)" 
                        class="px-3 py-1.5 rounded-lg text-[0.65rem] font-bold transition-all border"
                        [class.bg-red-500/10]="u.estActif" [class.text-red-400]="u.estActif" [class.border-red-500/20]="u.estActif" [class.hover:bg-red-500/20]="u.estActif"
                        [class.bg-green-500/10]="!u.estActif" [class.text-green-400]="!u.estActif" [class.border-green-500/20]="!u.estActif" [class.hover:bg-green-500/20]="!u.estActif">
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
      <div class="p-20 text-center"><div class="inline-block w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div></div>
    </ng-template>
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
