import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgIf, NgFor } from '@angular/common';
import { TicketService } from '../../../services/ticket.service';

@Component({
  selector: 'app-ticket-form',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, NgFor, RouterLink],
  templateUrl: './ticket-form.component.html',
  styles: []
})
export class TicketFormComponent {
  form: FormGroup;
  loading = false;
  priorities = ['FAIBLE', 'MOYENNE', 'HAUTE', 'CRITIQUE'];

  constructor(private fb: FormBuilder, private ticketService: TicketService, private router: Router) {
    this.form = this.fb.group({
      titre: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.required]],
      priorite: ['MOYENNE', [Validators.required]],
      categorie: ['TECHNIQUE', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    this.ticketService.createTicket(this.form.value).subscribe({
      next: () => this.router.navigate(['/tickets']),
      error: () => this.loading = false
    });
  }
}
