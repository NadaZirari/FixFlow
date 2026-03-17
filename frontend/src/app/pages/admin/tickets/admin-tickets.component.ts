import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-tickets',
  standalone: true,
  template: `
    <div class="p-8">
      <h1 class="text-2xl font-bold text-gray-800 mb-6">Gestion des Tickets</h1>
      <div class="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <p class="text-gray-600">Liste de tous les tickets...</p>
      </div>
    </div>
  `
})
export class AdminTicketsComponent {}
