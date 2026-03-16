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
        <a routerLink="/tickets" class="text-slate-400 hover:text-indigo-600 text-sm font-bold transition-colors flex items-center gap-2">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="16" height="16"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Retour à la liste
        </a>
        <h1 class="text-3xl font-black text-slate-900 mt-6">Nouveau Ticket</h1>
        <p class="text-slate-500">Décrivez votre problème pour qu'un agent puisse vous aider.</p>
      </header>

      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="bg-white border border-slate-200 rounded-[2.5rem] p-8 sm:p-10 shadow-2xl shadow-indigo-100/50 flex flex-col gap-8 relative overflow-hidden">
        <!-- Decorative subtle background -->
        <div class="absolute -top-24 -right-24 w-48 h-48 bg-indigo-50 rounded-full blur-3xl opacity-50"></div>
        
        <div class="flex flex-col gap-2 relative">
          <label class="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Titre du ticket</label>
          <input type="text" formControlName="titre" placeholder="Ex: Problème d'accès au serveur" 
            class="bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-800 placeholder:text-slate-400 outline-none transition-all focus:border-indigo-300 focus:bg-white shadow-inner">
        </div>

        <div class="flex flex-col gap-2 relative">
          <label class="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Catégorie</label>
          <div class="relative">
            <select formControlName="categorie" class="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-800 outline-none transition-all focus:border-indigo-300 focus:bg-white shadow-inner appearance-none cursor-pointer">
              <option value="TECHNIQUE">Technique</option>
              <option value="FACTURATION">Facturation</option>
              <option value="COMMERCIAL">Commercial</option>
              <option value="AUTRE">Autre</option>
            </select>
            <div class="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="16" height="16"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
            </div>
          </div>
        </div>

        <div class="flex flex-col gap-2 relative">
          <label class="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 text-center sm:text-left">Priorité du ticket</label>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button type="button" *ngFor="let p of priorities" (click)="form.patchValue({priorite: p})" 
              [class.bg-indigo-600]="form.get('priorite')?.value === p"
              [class.text-white]="form.get('priorite')?.value === p"
              [class.border-indigo-600]="form.get('priorite')?.value === p"
              [class.shadow-lg]="form.get('priorite')?.value === p"
              [class.shadow-indigo-200]="form.get('priorite')?.value === p"
              class="border border-slate-200 rounded-xl py-3 text-[0.65rem] font-bold text-slate-500 transition-all hover:bg-slate-50 active:scale-95">
              {{ p }}
            </button>
          </div>
        </div>

        <div class="flex flex-col gap-2 relative">
          <label class="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Description détaillée</label>
          <textarea formControlName="description" rows="5" placeholder="Merci de détailler votre demande..." 
            class="bg-slate-50 border border-slate-100 rounded-2xl px-6 py-5 text-slate-800 placeholder:text-slate-400 outline-none transition-all focus:border-indigo-300 focus:bg-white shadow-inner resize-none"></textarea>
        </div>

        <button type="submit" class="btn-primary !py-4 justify-center mt-2 shadow-indigo-100" [disabled]="loading || form.invalid">
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
