import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Comment, CommentRequest } from '../models/comment.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CommentService {
  private readonly API = `${environment.apiUrl}/commentaires`;

  constructor(private http: HttpClient) {}

  getCommentsByTicket(ticketId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.API}/ticket/${ticketId}`);
  }

  addComment(ticketId: number, req: CommentRequest): Observable<Comment> {
    return this.http.post<Comment>(`${this.API}/ticket/${ticketId}`, req);
  }

  deleteComment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }
}
