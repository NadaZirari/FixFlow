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
  templateUrl: './ticket-detail.component.html'
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
