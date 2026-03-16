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

        <div class="hidden md:flex items-center gap-6" style="display: flex; align-items: center; gap: 0.5rem;">
          <ng-container *ngIf="authService.currentUser$ | async as user; else guestLinks">
            <a routerLink="/dashboard" routerLinkActive="active" class="nav-link-tw">Dashboard</a>
            <a routerLink="/tickets" routerLinkActive="active" class="nav-link-tw">Mes Tickets</a>
            <a routerLink="/admin" *ngIf="authService.isAdmin$ | async" routerLinkActive="active" class="nav-link-tw">Admin</a>
            
            <div class="flex items-center gap-4 ml-4 pl-4 border-l border-slate-200" style="display: flex; align-items: center; gap: 1rem; margin-left: 1rem; padding-left: 1rem; border-left: 1px solid #e2e8f0;">
              <span class="text-sm font-medium text-slate-600" style="font-size: 0.875rem; color: #475569;">{{ user.nom }}</span>
              <button (click)="logout()" class="btn-secondary" style="padding: 0.5rem 1.25rem; font-size: 0.875rem; border-radius: 9999px;">Déconnexion</button>
            </div>
          </ng-container>
          <ng-template #guestLinks>
            <a routerLink="/login" class="nav-link-tw">Connexion</a>
            <a routerLink="/register" class="btn-primary" style="padding: 0.6rem 1.5rem; font-size: 0.875rem;">Commencer</a>
          </ng-template>
        </div>

        <button class="md:hidden flex flex-col gap-1.5 p-2" (click)="menuOpen = !menuOpen">
          <span class="w-6 h-0.5 bg-slate-900 rounded-full transition-all" [class.rotate-45]="menuOpen" [class.translate-y-2]="menuOpen" style="background-color: #0f172a;"></span>
          <span class="w-6 h-0.5 bg-slate-900 rounded-full transition-all" [class.opacity-0]="menuOpen" style="background-color: #0f172a;"></span>
          <span class="w-6 h-0.5 bg-slate-900 rounded-full transition-all" [class.-rotate-45]="menuOpen" [class.-translate-y-2]="menuOpen" style="background-color: #0f172a;"></span>
        </button>
      </div>

      <!-- Mobile Menu -->
      <div *ngIf="menuOpen" class="md:hidden bg-white/95 backdrop-blur-2xl border-b border-slate-200 px-4 py-6 flex flex-col gap-4 animate-in slide-in-from-top duration-300" style="background: rgba(255, 255, 255, 0.95); border-bottom: 1px solid #e2e8f0;">
        <ng-container *ngIf="authService.currentUser$ | async as user; else mobileGuestLinks">
          <a routerLink="/dashboard" class="text-slate-800 py-2 font-medium" (click)="menuOpen = false" style="color: #0f172a;">Dashboard</a>
          <a routerLink="/tickets" class="text-slate-800 py-2 font-medium" (click)="menuOpen = false" style="color: #0f172a;">Mes Tickets</a>
          <button class="bg-rose-50 border border-rose-200 text-rose-600 py-2 rounded-lg text-sm font-semibold mt-2" (click)="logout()">Déconnexion</button>
        </ng-container>
        <ng-template #mobileGuestLinks>
          <a routerLink="/login" class="text-slate-800 py-2 font-medium" (click)="menuOpen = false" style="color: #0f172a;">Connexion</a>
          <a routerLink="/register" class="btn-primary w-full text-center" (click)="menuOpen = false">Commencer</a>
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
