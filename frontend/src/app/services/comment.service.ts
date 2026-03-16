import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Comment, CommentRequest } from '../models/comment.model';

@Injectable({ providedIn: 'root' })
export class CommentService {
  private readonly API = 'http://localhost:8080/api/v1/commentaires';

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
