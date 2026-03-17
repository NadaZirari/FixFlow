import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  template: `
    <div class="p-8">
      <h1 class="text-2xl font-bold text-gray-800 mb-6">Tableau de bord Admin</h1>
      <div class="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <p class="text-gray-600">Statistiques et vue d'ensemble...</p>
      </div>
    </div>
  `
})
export class AdminDashboardComponent {}
