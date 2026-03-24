import { Component, OnInit } from '@angular/core';
import { AsyncPipe, NgIf, NgFor } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { User } from '../../models/user.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [AsyncPipe, NgIf, NgFor],
  templateUrl: './admin.component.html',
  styles: []
})
export class AdminComponent implements OnInit {
  users$?: Observable<User[]>;
  constructor(private http: HttpClient) {}
  ngOnInit() {
    this.users$ = this.http.get<User[]>('http://localhost:8080/api/v1/users');
  }
}
