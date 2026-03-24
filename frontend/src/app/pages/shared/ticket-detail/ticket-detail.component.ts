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
    <div class="p-4 sm:p-8 max-w-7xl mx-auto min-h-screen">
      <!-- Premium Header Section -->
      <nav class="flex items-center justify-between mb-10">
        <div class="flex items-center gap-6">
          <button (click)="goBack()" 
            class="w-12 h-12 bg-white border-2 border-gray-50 flex items-center justify-center rounded-2xl text-gray-400 hover:text-blue-600 hover:border-blue-100 hover:shadow-lg hover:shadow-blue-50 transition-all active:scale-95 group">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div>
            <div class="flex items-center gap-3 mb-1">
              <span class="text-xs font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-lg uppercase tracking-widest">Ticket #{{ ticketId }}</span>
              <span class="text-gray-400 font-bold text-xs uppercase tracking-widest">{{ ticket?.dateCreation | date:'dd MMMM yyyy' }}</span>
            </div>
            <h1 class="text-3xl font-black text-gray-900 tracking-tight leading-none">{{ ticket?.titre || 'Chargement...' }}</h1>
          </div>
        </div>
        
        <div *ngIf="ticket" class="hidden md:flex items-center gap-3">
          <span [ngClass]="getStatusClass(ticket.statut)" class="px-5 py-2 text-[0.65rem] font-black rounded-xl border-2 uppercase tracking-widest shadow-sm">
            {{ ticket.statut }}
          </span>
          <span [ngClass]="getPriorityClass(ticket.priorite)" class="px-5 py-2 text-[0.65rem] font-black rounded-xl border-2 uppercase tracking-widest shadow-sm">
            {{ ticket.priorite }}
          </span>
        </div>
      </nav>

      <div class="grid grid-cols-1 lg:grid-cols-4 gap-10">
        <!-- Main Content Area: Ticket Details & Conversation -->
        <div class="lg:col-span-3 space-y-10">
          <!-- Ticket Description Card -->
          <div class="bg-white rounded-[2.5rem] shadow-2xl shadow-gray-100 border border-gray-50 overflow-hidden">
            <div class="p-8 sm:p-10">
              <div class="flex items-center gap-4 mb-8 pb-8 border-b border-gray-50">
                <div class="w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-black shadow-inner"
                     [style.background-color]="getAvatarBg(ticket?.userNom || '')"
                     [style.color]="getAvatarColor(ticket?.userNom || '')">
                  {{ getInitials(ticket?.userNom || '') }}
                </div>
                <div>
                  <h3 class="text-lg font-black text-gray-900 tracking-tight">{{ ticket?.userNom }}</h3>
                  <p class="text-sm font-bold text-gray-400">Demandeur • {{ ticket?.categorieNom || 'Sans catégorie' }}</p>
                </div>
              </div>

              <div class="prose max-w-none">
                <p class="text-gray-600 leading-relaxed text-lg whitespace-pre-wrap font-medium">
                  {{ ticket?.description }}
                </p>
              </div>

              <!-- Attachment Preview -->
              <div *ngIf="ticket?.cheminFichier" class="mt-10 p-6 bg-gray-50/50 rounded-[2rem] border-2 border-dashed border-gray-100">
                <div class="flex items-center justify-between mb-4">
                  <h4 class="text-xs font-black text-gray-400 uppercase tracking-widest">Pièce jointe</h4>
                  <a [href]="'http://localhost:8081/uploads/' + ticket?.cheminFichier" target="_blank"
                    class="text-[0.65rem] font-black text-blue-600 hover:underline uppercase tracking-widest">Ouvrir l'original</a>
                </div>
                
                <div *ngIf="isImage(ticket!.cheminFichier!)" class="relative group">
                  <img [src]="'http://localhost:8081/uploads/' + ticket?.cheminFichier" 
                    alt="Attachement"
                    class="w-full max-h-96 object-cover rounded-2xl shadow-xl transition-all group-hover:brightness-90 cursor-pointer"
                    (click)="openImage('http://localhost:8081/uploads/' + ticket?.cheminFichier)">
                  <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <div class="bg-white/90 backdrop-blur px-6 py-3 rounded-2xl font-black text-blue-600 shadow-2xl">Agrandir l'image</div>
                  </div>
                </div>

                <div *ngIf="!isImage(ticket!.cheminFichier!)" class="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm border border-gray-100">
                  <div class="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h5 class="text-sm font-black text-gray-900 tracking-tight">{{ ticket?.cheminFichier }}</h5>
                    <p class="text-[0.6rem] font-bold text-gray-400 uppercase tracking-widest">Document • Fichier téléchargeable</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Conversation Section -->
          <div class="space-y-8">
            <div class="flex items-center justify-between px-4">
              <h3 class="text-xl font-black text-gray-900 flex items-center gap-3">
                <div class="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse"></div>
                Conversation
                <span class="ml-2 text-gray-300 font-bold">({{ comments.length }})</span>
              </h3>
            </div>

            <div class="space-y-6">
              <div *ngFor="let comment of comments" 
                   [ngClass]="isCurrentUser(comment.auteurNom) ? 'items-end' : 'items-start'"
                   class="flex flex-col gap-2 max-w-[85%] transition-all animate-in fade-in slide-in-from-bottom-2"
                   [style.align-self]="isCurrentUser(comment.auteurNom) ? 'flex-end' : 'flex-start'">
                
                <div class="flex items-center gap-2 mb-1 px-2">
                  <span class="text-[0.6rem] font-black uppercase tracking-widest" 
                        [ngClass]="isCurrentUser(comment.auteurNom) ? 'text-blue-600' : 'text-gray-400'">
                    {{ comment.auteurNom }}
                  </span>
                  <span class="text-[0.6rem] text-gray-300">•</span>
                  <span class="text-[0.6rem] text-gray-300 font-bold">{{ comment.date | date:'HH:mm' }}</span>
                </div>

                <div [ngClass]="isCurrentUser(comment.auteurNom) ? 
                     'bg-blue-600 text-white shadow-lg shadow-blue-100 rounded-[2rem] rounded-tr-none' : 
                     'bg-white text-gray-800 shadow-xl shadow-gray-100 rounded-[2rem] rounded-tl-none border border-gray-50'"
                     class="p-6">
                  <p class="text-sm font-medium leading-relaxed whitespace-pre-wrap">{{ comment.contenu }}</p>
                </div>
              </div>
            </div>

            <!-- New Response Area -->
            <div class="bg-white rounded-[3rem] shadow-2xl shadow-gray-200 p-4 border border-gray-50 focus-within:ring-4 focus-within:ring-blue-100/50 transition-all">
              <div class="relative">
                <textarea 
                  [(ngModel)]="newComment"
                  rows="3"
                  placeholder="Écrivez votre message..."
                  class="w-full bg-gray-50/50 rounded-[2.5rem] px-8 py-6 text-sm font-medium text-gray-800 outline-none resize-none transition-all placeholder:text-gray-300"
                ></textarea>
                <div class="absolute right-4 bottom-4 flex items-center gap-3">
                  <span class="text-[0.6rem] font-bold text-gray-300 uppercase hidden sm:block">Appuyez sur Envoyer</span>
                  <button 
                    (click)="postComment()"
                    [disabled]="!newComment.trim() || submitting"
                    class="w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-200 disabled:opacity-30 disabled:shadow-none transition-all active:scale-90 group/send">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 transform group-hover/send:-rotate-12 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar: Info & Management -->
        <div class="space-y-10">
          <!-- Management Card (Admin Only) -->
          <div *ngIf="isAdmin" class="bg-gray-900 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-gray-300 animate-in zoom-in duration-500">
            <h4 class="text-xs font-black uppercase tracking-widest text-emerald-400 mb-6 flex items-center gap-2">
              <div class="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
              Administration
            </h4>
            
            <div class="space-y-4">
              <button *ngIf="ticket?.statut === 'OUVERT'" 
                (click)="updateStatus('EN_COURS')"
                class="w-full py-4 px-6 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl text-sm font-black transition-all active:scale-95 flex items-center justify-between group">
                Prendre en charge
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-emerald-400 transform group-hover:rotate-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </button>
              
              <button *ngIf="ticket?.statut !== 'RESOLU'" 
                (click)="updateStatus('RESOLU')"
                class="w-full py-4 px-6 bg-emerald-500 hover:bg-emerald-600 rounded-2xl text-sm font-black transition-all active:scale-95 flex items-center justify-between group">
                Marquer Résolu
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </button>

              <div class="pt-4 border-t border-white/10">
                <p class="text-[0.6rem] font-black text-gray-500 uppercase tracking-widest mb-4">Urgence Actuelle</p>
                <div class="flex items-center gap-2">
                  <div class="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div class="h-full" [ngClass]="getPriorityProgressClass(ticket?.priorite)" [style.width]="getPriorityProgress(ticket?.priorite)"></div>
                  </div>
                  <span class="text-[0.65rem] font-black">{{ ticket?.priorite }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Metadata Card -->
          <div class="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl shadow-gray-50">
            <h4 class="text-xs font-black uppercase tracking-widest text-gray-400 mb-8 px-2">Informations</h4>
            
            <div class="space-y-6">
              <div class="flex flex-col gap-1 px-2">
                <span class="text-[0.65rem] font-black text-gray-400 uppercase tracking-widest">Catégorie</span>
                <span class="text-gray-900 font-black tracking-tight">{{ ticket?.categorieNom || 'Aucune' }}</span>
              </div>

              <div class="flex flex-col gap-1 px-2">
                <span class="text-[0.65rem] font-black text-gray-400 uppercase tracking-widest">Date de dépôt</span>
                <span class="text-gray-900 font-black tracking-tight">{{ ticket?.dateCreation | date:'longDate' }}</span>
              </div>

              <div class="flex flex-col gap-1 px-2">
                <span class="text-[0.65rem] font-black text-gray-400 uppercase tracking-widest">Dernière activité</span>
                <span class="text-gray-900 font-black tracking-tight">{{ comments.length > 0 ? (comments[comments.length-1].date | date:'shortTime') : 'Aucune' }}</span>
              </div>

              <div *ngIf="ticket?.cheminFichier" class="pt-4 border-t border-gray-50">
                <a [href]="'http://localhost:8081/uploads/' + ticket?.cheminFichier" target="_blank"
                   class="w-full py-4 flex items-center justify-center gap-3 bg-gray-50 hover:bg-gray-100 text-gray-600 font-black rounded-2xl transition-all text-xs tracking-widest uppercase">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Télécharger
                </a>
              </div>
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

  getInitials(name: string): string {
    if (!name) return '??';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  }

  getAvatarBg(name: string): string {
    const colors = ['#eff6ff', '#f5f3ff', '#fdf2f8', '#ecfdf5', '#fff7ed', '#fef2f2'];
    let hash = 0;
    for (let i = 0; i < (name?.length || 0); i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
  }

  getAvatarColor(name: string): string {
    const colors = ['#2563eb', '#7c3aed', '#db2777', '#059669', '#ea580c', '#dc2626'];
    let hash = 0;
    for (let i = 0; i < (name?.length || 0); i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
  }

  getPriorityProgress(priority?: string): string {
    switch (priority) {
      case 'CRITIQUE': return '100%';
      case 'HAUTE': return '75%';
      case 'MOYENNE': return '50%';
      default: return '25%';
    }
  }

  getPriorityProgressClass(priority?: string): string {
    switch (priority) {
      case 'CRITIQUE': return 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]';
      case 'HAUTE': return 'bg-orange-500';
      case 'MOYENNE': return 'bg-blue-500';
      default: return 'bg-emerald-500';
    }
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
      case 'CRITIQUE': return 'bg-red-50 text-red-700 border-red-200';
      case 'HAUTE': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'MOYENNE': return 'bg-blue-50 text-blue-700 border-blue-200';
      default: return 'bg-emerald-50 text-emerald-700 border-emerald-200';
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
