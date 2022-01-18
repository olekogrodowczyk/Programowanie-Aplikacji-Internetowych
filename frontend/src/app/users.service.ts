import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

export interface User {
  _id: string;
  login: string;
}

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  rootUrl = 'http://localhost:7777';
  constructor(private http: HttpClient) {}

  getUsersByRole(role: string) {
    return this.http.get<User[]>(`${this.rootUrl}/user?role=${role}`);
  }
}
