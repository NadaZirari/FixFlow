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
  templateUrl: './admin-users.component.html'
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

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  }

  getAvatarBg(name: string): string {
    const colors = ['#eff6ff', '#f5f3ff', '#fdf2f8', '#ecfdf5', '#fff7ed', '#fef2f2'];
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
  }

  getAvatarColor(name: string): string {
    const colors = ['#2563eb', '#7c3aed', '#db2777', '#059669', '#ea580c', '#dc2626'];
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
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
