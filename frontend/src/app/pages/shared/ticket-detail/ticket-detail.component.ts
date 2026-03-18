import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TicketService, Comment } from '../../../services/ticket.service';
import { Ticket } from '../../../models/ticket.model';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-ticket-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="p-8 max-w-5xl mx-auto">
      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <div class="flex items-center gap-4">
          <button (click)="goBack()" class="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div>
            <h1 class="text-3xl font-extrabold text-gray-900 tracking-tight">Détails du Ticket</h1>
            <p class="text-gray-500">Ticket #{{ ticket?.id }} • Créé le {{ ticket?.dateCreation | date:'dd/MM/yyyy' }}</p>
          </div>
        </div>
        <div *ngIf="ticket" class="flex items-center gap-3">
          <span [ngClass]="getStatusClass(ticket.statut)" class="px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border-2">
            {{ ticket.statut }}
          </span>
          <span [ngClass]="getPriorityClass(ticket.priorite)" class="px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border-2">
            {{ ticket.priorite }}
          </span>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Main Content (Ticket Info) -->
        <div class="lg:col-span-2 space-y-8">
          <div class="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            <div class="p-8">
              <h2 class="text-2xl font-bold text-gray-900 mb-4">{{ ticket?.titre }}</h2>
              <div class="prose max-w-none text-gray-600 mb-8 whitespace-pre-wrap">
                {{ ticket?.description }}
              </div>

              <!-- Image Preview if applicable -->
              <div *ngIf="ticket?.cheminFichier && isImage(ticket!.cheminFichier!)" class="mb-8 p-2 bg-gray-50 rounded-2xl border border-gray-100 inline-block">
                <img [src]="'http://localhost:8081/uploads/' + ticket?.cheminFichier" 
                     alt="Pièce jointe"
                     class="max-h-80 rounded-xl shadow-sm hover:scale-[1.02] transition-transform cursor-pointer"
                     (click)="openImage('http://localhost:8081/uploads/' + ticket?.cheminFichier)">
              </div>
              
              <div class="grid grid-cols-2 gap-6 pt-6 border-t border-gray-50 text-sm">
                <div>
                  <div class="text-gray-400 font-bold uppercase tracking-wider mb-1">Demandeur</div>
                  <div class="text-gray-900 font-semibold">{{ ticket?.userNom }}</div>
                </div>
                <div>
                  <div class="text-gray-400 font-bold uppercase tracking-wider mb-1">Catégorie</div>
                  <div class="text-gray-900 font-semibold">{{ ticket?.categorieNom || 'Non spécifiée' }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Comments Section -->
          <div class="space-y-6">
            <h3 class="text-xl font-bold text-gray-900 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Commentaires ({{ comments.length }})
            </h3>

            <!-- Comment List -->
            <div class="space-y-4">
              <div *ngFor="let comment of comments" 
                [ngClass]="{'items-end': isCurrentUser(comment.auteurNom)}"
                class="flex flex-col gap-1">
                <div [ngClass]="isCurrentUser(comment.auteurNom) ? 'bg-blue-600 text-white rounded-2xl rounded-tr-none' : 'bg-white border border-gray-100 text-gray-800 rounded-2xl rounded-tl-none shadow-sm'"
                  class="max-w-[80%] p-4">
                  <p class="whitespace-pre-wrap leading-relaxed">{{ comment.contenu }}</p>
                </div>
                <div class="flex items-center gap-2 px-2 text-[10px] font-bold uppercase tracking-tighter text-gray-400">
                  <span>{{ comment.auteurNom }}</span>
                  <span>•</span>
                  <span>{{ comment.date | date:'dd/MM/yyyy HH:mm' }}</span>
                </div>
              </div>
            </div>

            <!-- New Comment Form -->
            <div class="bg-gray-50 rounded-3xl p-6 mt-8">
              <div class="relative">
                <textarea 
                  [(ngModel)]="newComment"
                  rows="3"
                  placeholder="Écrivez votre réponse ici..."
                  class="w-full px-6 py-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none resize-none pr-16 shadow-inner"
                ></textarea>
                <button 
                  (click)="postComment()"
                  [disabled]="!newComment.trim() || submitting"
                  class="absolute bottom-4 right-4 p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-all shadow-lg shadow-blue-200">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar Actions -->
        <div class="space-y-6">
          <div class="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
            <h4 class="font-bold text-gray-900 mb-4 px-2">Actions</h4>
            <div class="space-y-2">
              <button *ngIf="isAdmin && ticket?.statut === 'OUVERT'" 
                (click)="updateStatus('EN_COURS')"
                class="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-amber-50 text-amber-700 font-bold transition-all group">
                <span class="p-2 bg-amber-100 rounded-lg group-hover:bg-amber-200 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
                Prendre en charge
              </button>
              
              <button *ngIf="isAdmin && ticket?.statut !== 'RESOLU'" 
                (click)="updateStatus('RESOLU')"
                class="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-emerald-50 text-emerald-700 font-bold transition-all group">
                <span class="p-2 bg-emerald-100 rounded-lg group-hover:bg-emerald-200 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                Marquer comme résolu
              </button>

              <a *ngIf="ticket?.cheminFichier" 
                [href]="'http://localhost:8081/uploads/' + ticket?.cheminFichier" 
                target="_blank"
                class="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 text-gray-600 font-bold transition-all group">
                <span class="p-2 bg-gray-100 rounded-lg group-hover:bg-gray-200 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </span>
                Télécharger PJ
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class TicketDetailComponent implements OnInit {
  ticket: Ticket | null = null;
  comments: Comment[] = [];
  newComment = '';
  submitting = false;
  isAdmin = false;
  ticketId: number = 0;

  constructor(
    private route: ActivatedRoute,
    private ticketService: TicketService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isAdmin = this.authService.currentUser?.role?.nom === 'ADMIN';
    this.route.params.subscribe(params => {
      this.ticketId = +params['id'];
      this.loadData();
    });
  }

  loadData(): void {
    this.ticketService.getById(this.ticketId).subscribe({
      next: (t) => this.ticket = t,
      error: (err) => console.error('Erreur chargement ticket:', err)
    });

    this.ticketService.getComments(this.ticketId).subscribe({
      next: (c) => this.comments = c,
      error: (err) => console.error('Erreur chargement commentaires:', err)
    });
  }

  postComment(): void {
    if (!this.newComment.trim()) return;
    this.submitting = true;
    this.ticketService.addComment(this.ticketId, this.newComment).subscribe({
      next: (c) => {
        this.comments.push(c);
        this.newComment = '';
        this.submitting = false;
      },
      error: (err) => {
        console.error('Erreur post commentaire:', err);
        this.submitting = false;
      }
    });
  }

  updateStatus(status: string): void {
    this.ticketService.updateStatus(this.ticketId, status).subscribe({
      next: (t) => {
        if (this.ticket) this.ticket.statut = t.statut;
      },
      error: (err) => console.error('Erreur MAJ statut:', err)
    });
  }

  isCurrentUser(name: string): boolean {
    return this.authService.currentUser?.nom === name;
  }

  goBack(): void {
    const rolePrefix = this.isAdmin ? 'admin' : 'user';
    this.router.navigate([`/${rolePrefix}/tickets`]);
  }

  getStatusClass(status?: string): string {
    switch (status) {
      case 'OUVERT': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'EN_COURS': return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'RESOLU': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'ARCHIVE': return 'bg-gray-50 text-gray-700 border-gray-100';
      default: return 'bg-gray-50 text-gray-700 border-gray-100';
    }
  }

  getPriorityClass(priority?: string): string {
    switch (priority) {
      case 'CRITIQUE': return 'bg-red-50 text-red-700 border-red-100';
      case 'HAUTE': return 'bg-orange-50 text-orange-700 border-orange-100';
      case 'MOYENNE': return 'bg-blue-50 text-blue-700 border-blue-100';
      default: return 'bg-gray-50 text-gray-700 border-gray-100';
    }
  }

  isImage(filename: string): boolean {
    const ext = filename.split('.').pop()?.toLowerCase();
    return ['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(ext || '');
  }

  openImage(url: string): void {
    window.open(url, '_blank');
  }
}
