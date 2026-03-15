import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AsyncPipe, NgIf } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, AsyncPipe, NgIf],
  template: `
    <nav class="navbar">
      <div class="nav-container">
        <a routerLink="/" class="nav-brand">
          <span class="brand-icon">⚡</span>
          <span class="brand-text">Fix<span class="brand-accent">Flow</span></span>
        </a>

        <div class="nav-links">
          <ng-container *ngIf="authService.currentUser$ | async as user; else guestLinks">
            <a routerLink="/dashboard" routerLinkActive="active" class="nav-link">Dashboard</a>
            <a routerLink="/tickets" routerLinkActive="active" class="nav-link">Mes Tickets</a>
            <a *ngIf="user.role === 'ADMIN'" routerLink="/admin" routerLinkActive="active" class="nav-link">Admin</a>
            <div class="nav-user">
              <span class="user-avatar">{{ user.nom.charAt(0).toUpperCase() }}</span>
              <span class="user-name">{{ user.nom }}</span>
              <button class="btn-logout" (click)="authService.logout()">Déconnexion</button>
            </div>
          </ng-container>
          <ng-template #guestLinks>
            <a routerLink="/login" class="nav-link">Connexion</a>
            <a routerLink="/register" class="btn-primary-sm">Commencer</a>
          </ng-template>
        </div>

        <button class="menu-toggle" (click)="menuOpen = !menuOpen">
          <span></span><span></span><span></span>
        </button>
      </div>
    </nav>
  `,
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  menuOpen = false;
  constructor(public authService: AuthService) {}
}
