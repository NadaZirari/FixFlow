import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-profile.component.html'
})
export class UserProfileComponent implements OnInit {
  profileForm: FormGroup;
  loading = false;
  success = '';
  error = '';
  user?: User;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService
  ) {
    this.profileForm = this.fb.group({
      nom: ['', [Validators.required]],
      prenom: [''],
      email: ['', [Validators.required, Validators.email]],
      motDePasse: ['', [Validators.minLength(4)]]
    });
  }

  ngOnInit(): void {
    this.user = this.authService.currentUser || undefined;
    if (this.user) {
      this.profileForm.patchValue({
        nom: this.user.nom,
        prenom: this.user.prenom,
        email: this.user.email
      });
    }
  }

  onSubmit(): void {
    if (this.profileForm.invalid || !this.user) return;

    this.loading = true;
    this.error = '';
    this.success = '';

    const updateData = { ...this.profileForm.value };
    if (!updateData.motDePasse) {
      delete updateData.motDePasse;
    }

    this.userService.update(this.user.id, updateData).subscribe({
      next: (updatedUser) => {
        this.loading = false;
        this.success = 'Profil mis à jour avec succès !';
        this.authService.updateUser(updatedUser);
        setTimeout(() => this.success = '', 3000);
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Erreur lors de la mise à jour du profil.';
        console.error(err);
      }
    });
  }
}
