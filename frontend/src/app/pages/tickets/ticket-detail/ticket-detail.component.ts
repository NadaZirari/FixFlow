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
        <a routerLink="/tickets" class="text-white/40 hover:text-white text-sm font-medium transition-colors flex items-center gap-2 mb-4">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="16" height="16"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Retour à la liste
        </a>
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-6" *ngIf="ticket">
          <div>
            <h1 class="text-3xl font-black text-white mb-2">{{ ticket.titre }}</h1>
            <div class="flex flex-wrap items-center gap-3">
              <span class="text-xs font-bold text-white/40 uppercase tracking-widest">#{{ ticket.id }}</span>
              <span class="w-1 h-1 rounded-full bg-white/20"></span>
              <span class="text-xs font-semibold text-white/60">Créé par {{ ticket.userNom }}</span>
              <span class="w-1 h-1 rounded-full bg-white/20"></span>
              <span class="text-xs font-semibold text-white/60">le {{ ticket.dateCreation | date:'medium' }}</span>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <span class="px-3 py-1.5 rounded-full text-[0.7rem] font-bold border" 
              [class.bg-green-500/10]="ticket.statut === 'RESOLU'" [class.text-green-400]="ticket.statut === 'RESOLU'" [class.border-green-500/20]="ticket.statut === 'RESOLU'"
              [class.bg-primary/10]="ticket.statut === 'OUVERT'" [class.text-primary-light]="ticket.statut === 'OUVERT'" [class.border-primary/20]="ticket.statut === 'OUVERT'"
              [class.bg-yellow-500/10]="ticket.statut === 'EN_COURS'" [class.text-yellow-400]="ticket.statut === 'EN_COURS'" [class.border-yellow-500/20]="ticket.statut === 'EN_COURS'">
              {{ ticket.statut }}
            </span>
            <span class="px-3 py-1.5 rounded-full text-[0.7rem] font-bold border border-white/10 bg-white/5 text-white/60">
              {{ ticket.priorite }}
            </span>
          </div>
        </div>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8" *ngIf="ticket">
        <!-- Main Content -->
        <div class="lg:col-span-2 flex flex-col gap-8">
          <!-- Description Card -->
          <div class="bg-white/5 border border-white/10 rounded-[2rem] p-8 backdrop-blur-md">
            <h2 class="text-xs font-bold text-white/30 uppercase tracking-widest mb-4 block">Description</h2>
            <p class="text-white/80 leading-relaxed whitespace-pre-wrap">{{ ticket.description }}</p>
            
            <div *ngIf="ticket.cheminFichier" class="mt-8 p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary-light">
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                </div>
                <div class="flex flex-col">
                  <span class="text-xs font-bold text-white">Pièce jointe</span>
                  <span class="text-[0.65rem] text-white/40 truncate max-w-[200px]">{{ ticket.cheminFichier }}</span>
                </div>
              </div>
              <a [href]="'http://localhost:8080/uploads/' + ticket.cheminFichier" target="_blank" class="text-primary-light text-xs font-bold hover:underline">Télécharger</a>
            </div>
          </div>

          <!-- Comments Section -->
          <div class="flex flex-col gap-6">
            <h2 class="text-xl font-bold text-white flex items-center gap-3 ml-2">
              Commentaires
              <span class="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[0.65rem] text-white/40 font-bold">{{ comments.length }}</span>
            </h2>

            <div class="flex flex-col gap-4">
              <div *ngFor="let c of comments" class="bg-white/5 border border-white/10 rounded-[1.5rem] p-6 backdrop-blur-md"
                [class.border-primary/30]="c.auteurNom === ticket.userNom"
                [class.bg-primary/5]="c.auteurNom === ticket.userNom">
                <div class="flex items-center justify-between mb-3">
                  <div class="flex items-center gap-2">
                    <span class="text-xs font-bold text-white">{{ c.auteurNom }}</span>
                    <span *ngIf="c.auteurNom === ticket.userNom" class="px-1.5 py-0.5 rounded-md bg-primary/20 text-primary-light text-[0.55rem] font-black uppercase">Client</span>
                  </div>
                  <span class="text-[0.65rem] text-white/30">{{ c.date | date:'short' }}</span>
                </div>
                <p class="text-sm text-white/70 leading-relaxed">{{ c.contenu }}</p>
              </div>

              <div *ngIf="comments.length === 0" class="p-12 text-center text-white/20 text-sm italic border border-dashed border-white/10 rounded-3xl">
                Aucun commentaire pour le moment.
              </div>
            </div>

            <!-- Add Comment -->
            <div class="bg-white/5 border border-white/10 rounded-[2rem] p-6 backdrop-blur-md mt-4">
              <textarea [(ngModel)]="newComment" rows="3" placeholder="Écrivez votre message ici..." 
                class="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-white/20 outline-none transition-all focus:border-primary/50 focus:bg-white/[0.08] resize-none mb-4"></textarea>
              <div class="flex justify-end">
                <button (click)="sendComment()" [disabled]="!newComment.trim() || sending" 
                  class="btn-primary !py-2.5 !px-6 !text-sm">
                  <span *ngIf="!sending">Envoyer</span>
                  <div *ngIf="sending" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar Actions -->
        <div class="flex flex-col gap-6">
          <div class="bg-white/5 border border-white/10 rounded-[2rem] p-6 backdrop-blur-md">
             <h2 class="text-xs font-bold text-white/30 uppercase tracking-widest mb-6 block ml-1">Actions d'administration</h2>
             
             <div class="flex flex-col gap-3">
               <button *ngIf="authService.isAdmin && ticket.statut === 'OUVERT'" (click)="updateStatus('EN_COURS')" class="w-full bg-primary/10 hover:bg-primary/20 border border-primary/20 text-primary-light py-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2">
                 ⚡ Prendre en charge
               </button>
               <button *ngIf="authService.isAdmin && ticket.statut !== 'RESOLU'" (click)="updateStatus('RESOLU')" class="w-full bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 text-green-400 py-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2">
                 ✅ Marquer comme résolu
               </button>
               <button *ngIf="authService.isAdmin" (click)="updateStatus('ARCHIVE')" class="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white/50 py-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2">
                 📦 Archiver le ticket
               </button>
               
               <div *ngIf="!authService.isAdmin" class="p-4 rounded-xl bg-white/3 border border-white/5">
                 <p class="text-[0.65rem] text-white/40 text-center uppercase font-bold tracking-widest">Seul un agent peut modifier le statut</p>
               </div>
             </div>
          </div>

          <!-- Info Card -->
          <div class="bg-white/5 border border-white/10 rounded-[2red] p-6 backdrop-blur-md">
             <div class="flex flex-col gap-4">
               <div class="flex justify-between items-center text-xs">
                 <span class="text-white/30 font-bold uppercase tracking-widest">Catégorie</span>
                 <span class="text-white font-semibold">{{ ticket.categorieNom || 'Non classé' }}</span>
               </div>
               <div class="flex justify-between items-center text-xs">
                 <span class="text-white/30 font-bold uppercase tracking-widest">Priorité</span>
                 <span class="text-white font-semibold">{{ ticket.priorite }}</span>
               </div>
               <div class="flex justify-between items-center text-xs">
                 <span class="text-white/30 font-bold uppercase tracking-widest">Identifiant</span>
                 <span class="text-white font-mono">#{{ ticket.id }}</span>
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
      next: (res) => {
        this.ticket = res.ticket;
        this.comments = res.comments;
      },
      error: (err) => console.error('Erreur chargement ticket', err)
    });
  }

  sendComment(): void {
    if (!this.newComment.trim() || !this.ticket) return;
    this.sending = true;
    this.commentService.addComment(this.ticket.id, { contenu: this.newComment }).subscribe({
      next: (comment) => {
        this.comments.push(comment);
        this.newComment = '';
        this.sending = false;
      },
      error: (err) => {
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
