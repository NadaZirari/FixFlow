import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgIf, NgFor } from '@angular/common';
import { TicketService } from '../../../services/ticket.service';

@Component({
  selector: 'app-ticket-form',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, NgFor, RouterLink],
  template: `
    <div class="pt-24 pb-12 px-4 sm:px-8 max-w-2xl mx-auto min-h-screen">
      <header class="mb-10">
        <a routerLink="/tickets" class="text-white/20 hover:text-white text-sm font-medium transition-colors">← Retour à la liste</a>
        <h1 class="text-3xl font-black text-white mt-4">Nouveau Ticket</h1>
        <p class="text-white/50">Décrivez votre problème pour qu'un agent puisse vous aider.</p>
      </header>

      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="bg-white/5 border border-white/10 backdrop-blur-2xl rounded-[2.5rem] p-8 sm:p-10 shadow-2xl flex flex-col gap-8">
        <div class="flex flex-col gap-2">
          <label class="text-xs font-bold text-white/40 uppercase tracking-widest ml-1">Titre du ticket</label>
          <input type="text" formControlName="titre" placeholder="Ex: Problème d'accès au serveur" 
            class="bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-white/20 outline-none transition-all focus:border-primary/50 focus:bg-white/[0.08]">
        </div>

        <div class="flex flex-col gap-2">
          <label class="text-xs font-bold text-white/40 uppercase tracking-widest ml-1">Catégorie</label>
          <select formControlName="categorie" class="bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none transition-all focus:border-primary/50 focus:bg-white/[0.08] appearance-none">
            <option value="TECHNIQUE">Technique</option>
            <option value="FACTURATION">Facturation</option>
            <option value="COMMERCIAL">Commercial</option>
            <option value="AUTRE">Autre</option>
          </select>
        </div>

        <div class="flex flex-col gap-2">
          <label class="text-xs font-bold text-white/40 uppercase tracking-widest ml-1">Priorité</label>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button type="button" *ngFor="let p of priorities" (click)="form.patchValue({priorite: p})" 
              [class.bg-primary]="form.get('priorite')?.value === p"
              [class.border-primary]="form.get('priorite')?.value === p"
              class="border border-white/10 rounded-xl py-3 text-xs font-bold text-white transition-all hover:bg-white/10">
              {{ p }}
            </button>
          </div>
        </div>

        <div class="flex flex-col gap-2">
          <label class="text-xs font-bold text-white/40 uppercase tracking-widest ml-1">Description détaillée</label>
          <textarea formControlName="description" rows="5" placeholder="Merci de détailler votre demande..." 
            class="bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-white/20 outline-none transition-all focus:border-primary/50 focus:bg-white/[0.08] resize-none"></textarea>
        </div>

        <button type="submit" class="btn-primary !py-4 justify-center" [disabled]="loading || form.invalid">
          <span *ngIf="!loading">Envoyer le ticket</span>
          <div *ngIf="loading" class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
        </button>
      </form>
    </div>
  `,
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
