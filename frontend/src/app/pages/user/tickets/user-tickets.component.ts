import { Component } from '@angular/core';

@Component({
  selector: 'app-user-tickets',
  standalone: true,
  template: `
    <div class="p-8">
      <h1 class="text-2xl font-bold text-gray-800 mb-6">Mes Tickets</h1>
      <div class="bg-white rounded-lg border border-gray-200 p-6">
        <p class="text-gray-500">Liste des tickets...</p>
      </div>
    </div>
  `
})
export class UserTicketsComponent {}
