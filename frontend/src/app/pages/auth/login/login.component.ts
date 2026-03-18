import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, NgIf],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  form: FormGroup;
  loading = false;
  error = '';
  showPassword = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      motDePasse: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    this.error = '';

    this.authService.login(this.form.value).subscribe({
      next: () => {
        const user = this.authService.currentUser;
        if (user?.role?.nom === 'ADMIN') {
          this.router.navigate(['/admin/dashboard']);
        } else {
          this.router.navigate(['/user/dashboard']);
        }
      },
      error: (err) => {
        console.error('DEBUG [Login]: Full error object:', err);
        const errorBody = err.error;
        const errorMsg = typeof errorBody === 'string' ? errorBody : errorBody?.error || '';
        
        if (err.status === 403 || errorMsg === 'ACCOUNT_DISABLED' || (typeof errorBody === 'object' && errorBody?.message?.includes('suspendu'))) {
          this.error = 'Votre compte est suspendu. Veuillez contacter l\'administrateur.';
        } else {
          this.error = 'Email ou mot de passe incorrect.';
        }
        this.loading = false;
      }
    });
  }
}
