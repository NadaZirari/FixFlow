import { Routes } from '@angular/router';
import { authGuard, adminGuard, publicGuard } from './guards/auth.guard';

export const routes: Routes = [
  // Public routes
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'login',
    canActivate: [publicGuard],
    loadComponent: () => import('./pages/auth/login/login.component').then(m => m.LoginComponent)
  },

  // User routes (with sidebar)
  {
    path: 'user',
    canActivate: [authGuard],
    loadComponent: () => import('./layouts/user-layout/user-layout.component').then(m => m.UserLayoutComponent),
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/user/dashboard/user-dashboard.component').then(m => m.UserDashboardComponent)
      },
      {
        path: 'tickets',
        loadComponent: () => import('./pages/user/tickets/user-tickets.component').then(m => m.UserTicketsComponent)
      },
      {
        path: 'tickets/new',
        loadComponent: () => import('./pages/user/tickets/new/user-ticket-new.component').then(m => m.UserTicketNewComponent)
      },
      {
        path: 'tickets/:id',
        loadComponent: () => import('./pages/shared/ticket-detail/ticket-detail.component').then(m => m.TicketDetailComponent)
      },
      {
        path: 'profile',
        loadComponent: () => import('./pages/user/profile/user-profile.component').then(m => m.UserProfileComponent)
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },

  // Admin routes (with sidebar)
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    loadComponent: () => import('./layouts/admin-layout/admin-layout.component').then(m => m.AdminLayoutComponent),
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/admin/dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent)
      },
      {
        path: 'tickets',
        loadComponent: () => import('./pages/admin/tickets/admin-tickets.component').then(m => m.AdminTicketsComponent)
      },
      {
        path: 'tickets/:id',
        loadComponent: () => import('./pages/shared/ticket-detail/ticket-detail.component').then(m => m.TicketDetailComponent)
      },
      {
        path: 'users',
        loadComponent: () => import('./pages/admin/users/admin-users.component').then(m => m.AdminUsersComponent)
      },
      {
        path: 'users/new',
        loadComponent: () => import('./pages/admin/users/new/admin-user-new.component').then(m => m.AdminUserNewComponent)
      },
      {
        path: 'configuration',
        loadComponent: () => import('./pages/admin/configuration/admin-configuration.component').then(m => m.AdminConfigurationComponent)
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },

  // Legacy routes redirects (for backward compatibility)
  {
    path: 'dashboard',
    redirectTo: 'user/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'tickets',
    redirectTo: 'user/tickets',
    pathMatch: 'full'
  },
  {
    path: 'tickets/new',
    redirectTo: 'user/tickets/new',
    pathMatch: 'full'
  },

  // Fallback
  { path: '**', redirectTo: 'login' }
];
