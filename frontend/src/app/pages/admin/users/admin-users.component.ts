import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UserService, CreateUserRequest } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="p-8">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-800">Gestion des Utilisateurs</h1>
        <button (click)="showForm = !showForm"
          class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          {{ showForm ? 'Annuler' : 'Ajouter un utilisateur' }}
        </button>
      </div>

      <!-- Formulaire d'ajout -->
      <div *ngIf="showForm" class="bg-white rounded-lg border border-gray-200 p-6 shadow-sm mb-6">
        <h2 class="text-lg font-semibold text-gray-800 mb-4">Nouvel utilisateur</h2>

        <div *ngIf="error" class="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
          {{ error }}
        </div>

        <div *ngIf="success" class="mb-4 p-3 rounded-lg bg-green-50 border border-green-200 text-green-600 text-sm">
          {{ success }}
        </div>

        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="flex flex-col gap-2">
            <label class="text-sm font-medium text-gray-700">Nom</label>
            <input type="text" formControlName="nom" placeholder="Nom complet"
              class="border border-gray-300 rounded-lg px-4 py-2 text-gray-800 outline-none focus:border-blue-500">
          </div>

          <div class="flex flex-col gap-2">
            <label class="text-sm font-medium text-gray-700">Email</label>
            <input type="email" formControlName="email" placeholder="email@exemple.com"
              class="border border-gray-300 rounded-lg px-4 py-2 text-gray-800 outline-none focus:border-blue-500">
          </div>

          <div class="flex flex-col gap-2">
            <label class="text-sm font-medium text-gray-700">Mot de passe</label>
            <input type="password" formControlName="motDePasse" placeholder="Mot de passe"
              class="border border-gray-300 rounded-lg px-4 py-2 text-gray-800 outline-none focus:border-blue-500">
          </div>

          <div class="md:col-span-2">
            <button type="submit" [disabled]="loading || form.invalid"
              class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50">
              {{ loading ? 'Creation...' : 'Creer l utilisateur' }}
            </button>
          </div>
        </form>
      </div>

      <!-- Liste des utilisateurs -->
      <div class="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div *ngIf="loadingUsers" class="p-6 text-center text-gray-500">
          Chargement...
        </div>

        <table *ngIf="!loadingUsers" class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr *ngFor="let user of users" class="hover:bg-gray-50">
              <td class="px-6 py-4 text-sm text-gray-800">{{ user.nom }}</td>
              <td class="px-6 py-4 text-sm text-gray-600">{{ user.email }}</td>
              <td class="px-6 py-4">
                <span [class]="user.role.nom === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'"
                  class="px-2 py-1 text-xs font-medium rounded-full">
                  {{ user.role.nom }}
                </span>
              </td>
              <td class="px-6 py-4">
                <span [class]="user.estActif ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                  class="px-2 py-1 text-xs font-medium rounded-full">
                  {{ user.estActif ? 'Actif' : 'Inactif' }}
                </span>
              </td>
              <td class="px-6 py-4 flex items-center gap-3">
                <button (click)="toggleStatus(user)"
                  [class]="user.estActif ? 'text-amber-600 hover:text-amber-800' : 'text-green-600 hover:text-green-800'"
                  class="text-sm font-bold flex items-center gap-1 transition-all">
                  <svg *ngIf="user.estActif" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
                  <svg *ngIf="!user.estActif" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  {{ user.estActif ? 'Suspendre' : 'Réactiver' }}
                </button>
                <span class="text-gray-300">|</span>
                <button (click)="deleteUser(user)"
                  class="text-red-600 hover:text-red-800 text-sm font-bold flex items-center gap-1 transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Supprimer
                </button>
              </td>
            </tr>
            <tr *ngIf="users.length === 0">
              <td colspan="5" class="px-6 py-4 text-center text-gray-500">
                Aucun utilisateur trouve
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class AdminUsersComponent implements OnInit {
  users: User[] = [];
  form: FormGroup;
  showForm = false;
  loading = false;
  loadingUsers = true;
  error = '';
  success = '';

  constructor(private fb: FormBuilder, private userService: UserService, private authService: AuthService) {
    this.form = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      motDePasse: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loadingUsers = true;
    const currentUserId = this.authService.currentUser?.id;
    this.userService.getAll().subscribe({
      next: (users) => {
        this.users = users.filter(u => u.id !== currentUserId);
        this.loadingUsers = false;
      },
      error: (err) => {
        console.error('Erreur chargement utilisateurs:', err);
        this.loadingUsers = false;
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    this.loading = true;
    this.error = '';
    this.success = '';

    const userData: CreateUserRequest = {
      ...this.form.value,
      role: { nom: 'USER' }
    };

    this.userService.create(userData).subscribe({
      next: (user) => {
        this.success = `Utilisateur ${user.nom} cree avec succes`;
        this.loading = false;
        this.form.reset();
        this.loadUsers();
        setTimeout(() => {
          this.showForm = false;
          this.success = '';
        }, 2000);
      },
      error: (err) => {
        this.error = err.error?.message || 'Erreur lors de la creation';
        this.loading = false;
      }
    });
  }

  deleteUser(user: User): void {
    if (confirm(`Supprimer l'utilisateur ${user.nom} ?`)) {
      this.userService.delete(user.id).subscribe({
        next: () => this.loadUsers(),
        error: (err) => console.error('Erreur suppression:', err)
      });
    }
  }

  toggleStatus(user: User): void {
    const action = user.estActif ? 'suspendre' : 'réactiver';
    if (confirm(`Voulez-vous ${action} l'utilisateur ${user.nom} ?`)) {
      this.userService.toggleStatus(user.id).subscribe({
        next: () => this.loadUsers(),
        error: (err) => {
          console.error(`Erreur lors de l'action ${action}:`, err);
          alert(`Erreur lors de l'action ${action}.`);
        }
      });
    }
  }
}
