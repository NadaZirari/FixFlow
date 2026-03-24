import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { TicketService, Categorie } from '../../../../services/ticket.service';

@Component({
  selector: 'app-user-ticket-new',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './user-ticket-new.component.html'
})
export class UserTicketNewComponent implements OnInit {
  ticketForm: FormGroup;
  categories: Categorie[] = [];
  submitting = false;
  showErrors = false;
  selectedFile: File | null = null;
  message: string | null = null;
  messageType: 'success' | 'error' = 'success';

  constructor(
    private fb: FormBuilder,
    private ticketService: TicketService,
    private router: Router
  ) {
    this.ticketForm = this.fb.group({
      titre: ['', [Validators.required, Validators.minLength(5)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      priorite: ['MOYENNE', [Validators.required]],
      categorieId: [null, [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.ticketService.getCategories().subscribe({
      next: (cats) => this.categories = cats,
      error: (err) => console.error('Erreur chargement categories:', err)
    });
  }

  get f() { return this.ticketForm.controls; }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  removeFile(event: Event): void {
    event.stopPropagation();
    this.selectedFile = null;
  }

  onSubmit(): void {
    this.showErrors = true;
    if (this.ticketForm.invalid) return;

    this.submitting = true;
    this.message = null;

    this.ticketService.createTicket(this.ticketForm.value, this.selectedFile).subscribe({
      next: (res) => {
        this.message = 'Ticket créé avec succès !';
        this.messageType = 'success';
        setTimeout(() => this.router.navigate(['/user/tickets']), 1500);
      },
      error: (err) => {
        console.error('Erreur creation ticket:', err);
        this.message = 'Erreur lors de la création.';
        this.messageType = 'error';
        this.submitting = false;
      }
    });
  }
}
