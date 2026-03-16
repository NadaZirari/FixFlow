import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AsyncPipe, NgIf } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, AsyncPipe, NgIf],
  template: `
    <nav class="fixed top-0 left-0 right-0 z-[1000] bg-[#0a0a14]/85 backdrop-blur-xl border-b border-primary/15 h-[70px]">
      <div class="max-w-7xl mx-auto px-4 sm:px-8 h-full flex items-center justify-between">
        <a routerLink="/" class="flex items-center gap-2 no-underline">
          <span class="text-2xl drop-shadow-[0_0_8px_#8b5cf6]">⚡</span>
          <span class="text-xl font-extrabold text-white tracking-tight">Fix<span class="bg-gradient-to-br from-primary to-secondary bg-clip-text text-transparent">Flow</span></span>
        </a>

        <div class="hidden md:flex items-center gap-6">
          <ng-container *ngIf="authService.currentUser$ | async as user; else guestLinks">
            <a routerLink="/dashboard" routerLinkActive="active" class="nav-link-tw">Dashboard</a>
            <a routerLink="/tickets" routerLinkActive="active" class="nav-link-tw">Mes Tickets</a>
            <a *ngIf="user.role === 'ADMIN'" routerLink="/admin" routerLinkActive="active" class="nav-link-tw">Admin</a>
            <div class="flex items-center gap-3 ml-2">
              <span class="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center font-bold text-sm text-white shadow-lg">
                {{ user.nom.charAt(0).toUpperCase() }}
              </span>
              <span class="text-white/80 text-sm font-medium hidden lg:block">{{ user.nom }}</span>
              <button class="bg-red-500/10 border border-red-500/30 text-red-500 px-4 py-1.5 rounded-lg cursor-pointer text-xs font-semibold transition-all hover:bg-red-500/20 hover:border-red-500/60" (click)="authService.logout()">Déconnexion</button>
            </div>
          </ng-container>
          <ng-template #guestLinks>
            <a routerLink="/login" class="nav-link-tw">Connexion</a>
            <a routerLink="/register" class="bg-gradient-to-br from-primary to-secondary text-white px-5 py-2 rounded-full no-underline font-semibold text-sm transition-all shadow-lg hover:-translate-y-0.5 hover:shadow-primary/40">Commencer</a>
          </ng-template>
        </div>

        <button class="md:hidden flex flex-col gap-1.5 p-2" (click)="menuOpen = !menuOpen">
          <span class="w-6 h-0.5 bg-white rounded-full transition-all" [class.rotate-45]="menuOpen" [class.translate-y-2]="menuOpen"></span>
          <span class="w-6 h-0.5 bg-white rounded-full transition-all" [class.opacity-0]="menuOpen"></span>
          <span class="w-6 h-0.5 bg-white rounded-full transition-all" [class.-rotate-45]="menuOpen" [class.-translate-y-2]="menuOpen"></span>
        </button>
      </div>

      <!-- Mobile Menu -->
      <div *ngIf="menuOpen" class="md:hidden bg-[#0a0a14]/95 backdrop-blur-2xl border-b border-primary/15 px-4 py-6 flex flex-col gap-4 animate-in slide-in-from-top duration-300">
        <ng-container *ngIf="authService.currentUser$ | async as user; else mobileGuestLinks">
          <a routerLink="/dashboard" class="text-white/80 py-2 font-medium" (click)="menuOpen = false">Dashboard</a>
          <a routerLink="/tickets" class="text-white/80 py-2 font-medium" (click)="menuOpen = false">Mes Tickets</a>
          <button class="bg-red-500/10 border border-red-500/30 text-red-500 py-2 rounded-lg text-sm font-semibold mt-2" (click)="authService.logout(); menuOpen = false">Déconnexion</button>
        </ng-container>
        <ng-template #mobileGuestLinks>
          <a routerLink="/login" class="text-white/80 py-2 font-medium" (click)="menuOpen = false">Connexion</a>
          <a routerLink="/register" class="bg-gradient-to-br from-primary to-secondary text-white py-3 rounded-full text-center font-bold" (click)="menuOpen = false">Commencer</a>
        </ng-template>
      </div>
    </nav>
  `,
  styles: []
})
export class NavbarComponent {
  menuOpen = false;
  constructor(public authService: AuthService) {}
}
