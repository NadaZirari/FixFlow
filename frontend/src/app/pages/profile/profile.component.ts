import { Component } from '@angular/core';
import { AsyncPipe, NgIf, DatePipe } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [AsyncPipe, NgIf, DatePipe],
  template: `
    <div class="pt-24 pb-12 px-4 sm:px-8 max-w-4xl mx-auto min-h-screen">
      <header class="mb-12">
        <h1 class="text-3xl font-black text-slate-900 mb-2">Mon Profil</h1>
        <p class="text-slate-500">Gérez vos informations personnelles</p>
      </header>

      <div *ngIf="authService.currentUser$ | async as user; else loading" class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Profile Card -->
        <div class="md:col-span-1">
          <div class="bg-white border border-slate-200 p-8 rounded-3xl shadow-sm flex flex-col items-center text-center">
            <div class="w-24 h-24 rounded-full bg-indigo-50 flex items-center justify-center text-3xl font-black text-indigo-600 mb-6 border-4 border-white shadow-lg">
              {{ user.nom.charAt(0) }}
            </div>
            <h2 class="text-xl font-bold text-slate-900 mb-1">{{ user.nom }}</h2>
            <span class="px-3 py-1 rounded-full text-[0.65rem] font-bold bg-indigo-50 text-indigo-600 border border-indigo-100 uppercase tracking-wider mb-6">
              {{ user.role }}
            </span>
            <div class="w-full pt-6 border-t border-slate-100">
              <p class="text-xs text-slate-400 uppercase font-black tracking-widest mb-1">Membre depuis</p>
              <p class="text-sm font-bold text-slate-600">{{ (user.dateCreation || 'N/A') | date:'longDate' }}</p>
            </div>
          </div>
        </div>

        <!-- Details -->
        <div class="md:col-span-2">
          <div class="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
            <div class="p-8 border-b border-slate-100">
              <h3 class="text-lg font-bold text-slate-900">Informations du compte</h3>
            </div>
            <div class="p-8 space-y-8">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div>
                  <label class="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Nom complet</label>
                  <div class="p-4 bg-slate-50 rounded-xl border border-slate-100 font-semibold text-slate-900">{{ user.nom }}</div>
                </div>
                <div>
                  <label class="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Adresse Email</label>
                  <div class="p-4 bg-slate-50 rounded-xl border border-slate-100 font-semibold text-slate-900">{{ user.email }}</div>
                </div>
              </div>

              <div>
                <label class="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Statut du compte</label>
                <div class="flex items-center gap-2">
                   <span [class.text-emerald-500]="user.estActif" [class.text-rose-500]="!user.estActif" class="flex items-center gap-2 font-bold">
                     <span class="w-2 h-2 rounded-full" [class.bg-emerald-500]="user.estActif" [class.bg-rose-500]="!user.estActif"></span>
                     {{ user.estActif ? 'Compte Actif' : 'Compte Inactif' }}
                   </span>
                </div>
              </div>
            </div>
            
            <div class="p-8 bg-slate-50 border-t border-slate-100 flex justify-end">
               <button class="bg-rose-50 text-rose-600 px-6 py-2 rounded-xl text-sm font-bold border border-rose-100 hover:bg-rose-100 transition-colors" (click)="authService.logout()">
                 Se déconnecter
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <ng-template #loading>
      <div class="min-h-screen flex items-center justify-center">
        <div class="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    </ng-template>
  `,
  styles: []
})
export class ProfileComponent {}
