import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AsyncPipe, NgIf } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, AsyncPipe, NgIf],
  template: `
    <nav class="fixed top-0 left-0 right-0 z-[1000] h-[70px]" 
         style="position: fixed; top: 0; left: 0; right: 0; z-index: 1000; height: 70px; display: flex; align-items: center; background: rgba(255, 255, 255, 0.8); backdrop-filter: blur(20px); border-bottom: 1px solid rgba(0, 0, 0, 0.05);">
      <div class="max-w-7xl mx-auto px-4 sm:px-8 h-full flex items-center justify-between w-full" style="display: flex; justify-content: space-between; align-items: center; width: 100%; max-width: 80rem; margin: 0 auto;">
        <a routerLink="/" class="flex items-center gap-2 no-underline group" style="display: flex; align-items: center; gap: 0.5rem; text-decoration: none;">
          <span class="text-2xl transition-transform group-hover:scale-110" style="font-size: 1.5rem;">⚡</span>
          <span class="text-xl font-bold tracking-tight" style="font-size: 1.25rem; font-weight: 700; color: #0f172a;">Fix<span class="gradient-text">Flow</span></span>
        </a>

        <div class="md-flex items-center gap-6" style="align-items: center; gap: 0.5rem;">
          <ng-container *ngIf="authService.currentUser$ | async as user; else guestOrLoading">
            <a routerLink="/dashboard" routerLinkActive="active" class="nav-link-tw">Dashboard</a>
            <a routerLink="/tickets" routerLinkActive="active" class="nav-link-tw">Mes Tickets</a>
            <a routerLink="/admin" *ngIf="authService.isAdmin$ | async" routerLinkActive="active" class="nav-link-tw">Admin</a>
            
            <div class="flex items-center gap-4 ml-4 pl-4 border-l border-slate-200" style="display: flex; align-items: center; gap: 1rem; margin-left: 1rem; padding-left: 1rem; border-left: 1px solid #e2e8f0;">
              <a routerLink="/profile" class="flex items-center gap-2 hover:bg-slate-50 p-2 rounded-xl transition-colors no-underline">
                <div class="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-[0.65rem] font-black text-indigo-600 border border-indigo-100 uppercase">{{ user.nom.charAt(0) }}</div>
                <span class="text-xs font-bold text-slate-400 capitalize">{{ user.nom }}</span>
              </a>
              <button (click)="logout()" class="px-4 py-2 rounded-full text-xs font-bold bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-100 transition-colors">
                Déconnexion
              </button>
            </div>
          </ng-container>
          <ng-template #guestOrLoading>
            <ng-container *ngIf="authService.isLoggedIn; else guestLinks">
              <div class="flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-full animate-pulse border border-slate-100">
                <div class="w-6 h-6 rounded-full bg-slate-200"></div>
                <div class="w-16 h-2 bg-slate-200 rounded"></div>
              </div>
            </ng-container>
            <ng-template #guestLinks>
              <a routerLink="/login" class="nav-link-tw">Connexion</a>
              <a routerLink="/register" class="btn-primary" style="padding: 0.6rem 1.5rem; font-size: 0.875rem;">Commencer</a>
            </ng-template>
          </ng-template>
        </div>

        <button class="md:hidden flex flex-col gap-1.5 p-2" (click)="menuOpen = !menuOpen" style="display: flex; flex-direction: column;">
          <span class="w-6 h-0.5 bg-slate-900 rounded-full transition-all" [class.rotate-45]="menuOpen" [class.translate-y-2]="menuOpen" style="background-color: #0f172a;"></span>
          <span class="w-6 h-0.5 bg-slate-900 rounded-full transition-all" [class.opacity-0]="menuOpen" style="background-color: #0f172a;"></span>
          <span class="w-6 h-0.5 bg-slate-900 rounded-full transition-all" [class.-rotate-45]="menuOpen" [class.-translate-y-2]="menuOpen" style="background-color: #0f172a;"></span>
        </button>
      </div>

      <!-- Mobile Menu -->
      <div *ngIf="menuOpen" class="md:hidden bg-white/95 backdrop-blur-2xl border-b border-slate-200 px-4 py-8 flex flex-col gap-6 animate-in slide-in-from-top duration-300" style="background: rgba(255, 255, 255, 0.98); border-bottom: 1px solid #e2e8f0; display: flex; flex-direction: column;">
        <ng-container *ngIf="authService.currentUser$ | async as user; else mobileGuestLinks">
          <div class="px-2 mb-2">
            <span class="text-[0.6rem] font-black text-slate-400 uppercase tracking-[0.2em]">Connecté en tant que</span>
            <div class="text-sm font-bold text-slate-900">{{ user.nom }}</div>
          </div>
          <a routerLink="/dashboard" class="text-slate-800 py-3 font-bold border-b border-slate-50" (click)="menuOpen = false" style="color: #0f172a;">Dashboard</a>
          <a routerLink="/tickets" class="text-slate-800 py-3 font-bold border-b border-slate-50" (click)="menuOpen = false" style="color: #0f172a;">Mes Tickets</a>
          <a routerLink="/profile" class="text-slate-800 py-3 font-bold border-b border-slate-50" (click)="menuOpen = false" style="color: #0f172a;">Mon Profil</a>
          <button class="w-full bg-rose-600 text-white py-4 rounded-2xl text-sm font-black mt-4 shadow-lg shadow-rose-100" (click)="logout()">
            DÉCONNEXION
          </button>
        </ng-container>
        <ng-template #mobileGuestLinks>
          <a routerLink="/login" class="text-slate-800 py-3 font-bold border-b border-slate-50" (click)="menuOpen = false" style="color: #0f172a;">Connexion</a>
          <a routerLink="/register" class="btn-primary w-full text-center !py-4" (click)="menuOpen = false">Commencer gratuitement</a>
        </ng-template>
      </div>
    </nav>
  `,
  styles: []
})
export class NavbarComponent {
  menuOpen = false;
  constructor(public authService: AuthService) {}

  logout(): void {
    this.authService.logout();
    this.menuOpen = false;
  }
}
