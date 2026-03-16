import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TicketService } from '../../../services/ticket.service';
import { CommentService } from '../../../services/comment.service';
import { AuthService } from '../../../services/auth.service';
import { Ticket, StatutTicket } from '../../../models/ticket.model';
import { Comment } from '../../../models/comment.model';
import { forkJoin, Observable, of } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-ticket-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, DatePipe],
  template: `
    <div class="pt-24 pb-12 px-4 sm:px-8 max-w-5xl mx-auto min-h-screen">
      <header class="mb-8">
        <a routerLink="/tickets" class="text-slate-400 hover:text-indigo-600 text-sm font-medium transition-colors flex items-center gap-2 mb-6">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="16" height="16"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Retour à la liste
        </a>
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-6" *ngIf="ticket">
          <div>
            <h1 class="text-3xl font-black text-slate-900 mb-2">{{ ticket.titre }}</h1>
            <div class="flex flex-wrap items-center gap-3">
              <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">#{{ ticket.id }}</span>
              <span class="w-1 h-1 rounded-full bg-slate-200"></span>
              <span class="text-xs font-semibold text-slate-500">Créé par <span class="text-slate-700">{{ ticket.userNom }}</span></span>
              <span class="w-1 h-1 rounded-full bg-slate-200"></span>
              <span class="text-xs font-semibold text-slate-500">le {{ ticket.dateCreation | date:'medium' }}</span>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <span class="px-4 py-1.5 rounded-full text-[0.7rem] font-bold border shadow-sm" 
              [class.bg-emerald-50]="ticket.statut === 'RESOLU'" [class.text-emerald-600]="ticket.statut === 'RESOLU'" [class.border-emerald-100]="ticket.statut === 'RESOLU'"
              [class.bg-indigo-50]="ticket.statut === 'OUVERT'" [class.text-indigo-600]="ticket.statut === 'OUVERT'" [class.border-indigo-100]="ticket.statut === 'OUVERT'"
              [class.bg-amber-50]="ticket.statut === 'EN_COURS'" [class.text-amber-600]="ticket.statut === 'EN_COURS'" [class.border-amber-100]="ticket.statut === 'EN_COURS'">
              {{ ticket.statut }}
            </span>
            <span class="px-3 py-1.5 rounded-full text-[0.7rem] font-bold border border-slate-200 bg-white text-slate-500 shadow-sm">
              {{ ticket.priorite }}
            </span>
          </div>
        </div>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8" *ngIf="ticket">
        <!-- Main Content -->
        <div class="lg:col-span-2 flex flex-col gap-8">
          <!-- Description Card -->
          <div class="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm">
            <h2 class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 block">Description du problème</h2>
            <p class="text-slate-700 leading-relaxed text-lg whitespace-pre-wrap">{{ ticket.description }}</p>
            
            <div *ngIf="ticket.cheminFichier" class="mt-8 p-5 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-white shadow-sm border border-slate-200 flex items-center justify-center text-indigo-600">
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                </div>
                <div class="flex flex-col">
                   <span class="text-xs font-bold text-slate-900">Pièce jointe</span>
                   <span class="text-[0.65rem] text-slate-400 truncate max-w-[200px]">{{ ticket.cheminFichier }}</span>
                </div>
              </div>
              <a [href]="'http://localhost:8080/uploads/' + ticket.cheminFichier" target="_blank" class="text-indigo-600 text-xs font-bold hover:underline">Télécharger</a>
            </div>
          </div>

          <!-- Comments Section -->
          <div class="flex flex-col gap-6">
            <h2 class="text-xl font-bold text-slate-800 flex items-center gap-3 ml-2">
              Commentaires
              <span class="px-2.5 py-0.5 rounded-lg bg-indigo-50 border border-indigo-100 text-[0.7rem] text-indigo-600 font-bold shadow-sm">{{ comments.length }}</span>
            </h2>

            <div class="flex flex-col gap-5">
              <div *ngFor="let c of comments" class="bg-white border border-slate-200 rounded-[1.5rem] p-6 shadow-sm relative transition-all hover:border-slate-300"
                [class.border-indigo-100]="c.auteurNom === ticket.userNom"
                [class.bg-indigo-50/10]="c.auteurNom === ticket.userNom">
                <div class="flex items-center justify-between mb-4">
                  <div class="flex items-center gap-2">
                    <div class="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-[0.65rem] font-bold text-slate-600 uppercase">{{ c.auteurNom.charAt(0) }}</div>
                    <span class="text-sm font-bold text-slate-800">{{ c.auteurNom }}</span>
                    <span *ngIf="c.auteurNom === ticket.userNom" class="px-2 py-0.5 rounded bg-indigo-50 text-indigo-600 text-[0.6rem] font-bold uppercase tracking-wider">Client</span>
                  </div>
                  <span class="text-[0.65rem] text-slate-400 font-medium">{{ c.date | date:'short' }}</span>
                </div>
                <p class="text-sm text-slate-600 leading-relaxed">{{ c.contenu }}</p>
              </div>

              <div *ngIf="comments.length === 0" class="p-16 text-center text-slate-400 text-sm border-2 border-dashed border-slate-100 rounded-3xl bg-slate-50/50">
                 <div class="text-3xl mb-3">💬</div>
                 <p class="italic">Aucun commentaire pour le moment.</p>
              </div>
            </div>

            <!-- Add Comment -->
            <div class="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-md mt-4">
              <textarea [(ngModel)]="newComment" rows="4" placeholder="Tapez votre réponse ici..." 
                class="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-5 text-slate-800 placeholder:text-slate-400 outline-none transition-all focus:border-indigo-300 focus:bg-white resize-none mb-4 shadow-inner"></textarea>
              <div class="flex justify-end">
                <button (click)="sendComment()" [disabled]="!newComment.trim() || sending" 
                  class="btn-primary">
                  <span *ngIf="!sending">Envoyer la réponse</span>
                  <div *ngIf="sending" class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar Actions -->
        <div class="flex flex-col gap-6">
          <div class="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm">
             <h2 class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 block">Actions rapides</h2>
             
             <div class="flex flex-col gap-3">
               <button *ngIf="authService.isAdmin$ | async" (click)="updateStatus('EN_COURS')" class="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-bold text-xs shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 mb-2">
                 ⚡ Prendre en charge
               </button>
               <button *ngIf="authService.isAdmin$ | async" (click)="updateStatus('RESOLU')" class="w-full bg-white border border-emerald-200 text-emerald-600 py-3.5 rounded-xl font-bold text-xs shadow-sm hover:bg-emerald-50 transition-all flex items-center justify-center gap-2">
                 ✅ Résoudre le ticket
               </button>
               <button *ngIf="authService.isAdmin$ | async" (click)="updateStatus('ARCHIVE')" class="w-full bg-white border border-slate-200 text-slate-400 py-3.5 rounded-xl font-bold text-xs hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                 📦 Archiver
               </button>
               
               <ng-container *ngIf="!(authService.isAdmin$ | async)">
                 <div class="p-5 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                   <p class="text-[0.65rem] text-slate-400 uppercase font-black tracking-widest leading-loose">Seul un agent peut modifier le statut de ce ticket</p>
                 </div>
               </ng-container>
             </div>
          </div>

          <!-- Metadata Sidebar -->
          <div class="bg-indigo-600 rounded-[2rem] p-8 text-white shadow-xl shadow-indigo-100 relative overflow-hidden">
             <!-- Decorative -->
             <div class="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
             <div class="absolute -bottom-10 -left-10 w-24 h-24 bg-indigo-400/20 rounded-full blur-2xl"></div>
             
             <h2 class="text-xs font-bold text-white/50 uppercase tracking-widest mb-6 block relative z-10">Détails du ticket</h2>
             <div class="flex flex-col gap-6 relative z-10">
               <div>
                 <span class="text-[0.6rem] text-white/50 uppercase font-black block mb-1">Catégorie</span>
                 <span class="text-sm font-bold">{{ ticket.categorieNom || 'Non classé' }}</span>
               </div>
               <div>
                 <span class="text-[0.6rem] text-white/50 uppercase font-black block mb-1">Priorité</span>
                 <span class="text-sm font-bold flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full" [class.bg-rose-400]="ticket.priorite === 'HAUTE'" [class.bg-emerald-400]="ticket.priorite === 'BASSE'"></span>
                    {{ ticket.priorite }}
                 </span>
               </div>
               <div>
                  <span class="text-[0.6rem] text-white/50 uppercase font-black block mb-1">Création</span>
                  <span class="text-sm font-bold">{{ ticket.dateCreation | date:'short' }}</span>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class TicketDetailComponent implements OnInit {
  ticket?: any;
  comments: Comment[] = [];
  newComment: string = '';
  sending = false;

  constructor(
    private route: ActivatedRoute,
    private ticketService: TicketService,
    private commentService: CommentService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loadData(id);
    }
  }

  loadData(id: number): void {
    forkJoin({
      ticket: this.ticketService.getTicketById(id),
      comments: this.commentService.getCommentsByTicket(id)
    }).subscribe({
      next: (res: { ticket: Ticket, comments: Comment[] }) => {
        this.ticket = res.ticket;
        this.comments = res.comments;
      },
      error: (err: any) => console.error('Erreur chargement ticket', err)
    });
  }

  sendComment(): void {
    if (!this.newComment.trim() || !this.ticket) return;
    this.sending = true;
    this.commentService.addComment(this.ticket.id, { contenu: this.newComment }).subscribe({
      next: (comment: Comment) => {
        this.comments.push(comment);
        this.newComment = '';
        this.sending = false;
      },
      error: (err: any) => {
        console.error('Erreur ajout commentaire', err);
        this.sending = false;
      }
    });
  }

  updateStatus(statut: string): void {
    if (!this.ticket) return;
    this.ticketService.updateStatus(this.ticket.id, statut).subscribe({
      next: (res) => {
        this.ticket.statut = res.statut;
      },
      error: (err) => console.error('Erreur status', err)
    });
  }
}
