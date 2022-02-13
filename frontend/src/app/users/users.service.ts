import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

export interface User {
  _id: string;
  login: string;
  firstName: string;
  lastName: string;
  roles: string[];
}

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  users!: User[];
  rootUrl = 'http://localhost:7777';
  constructor(private http: HttpClient) {}

  getUsers() {
    return this.http.get<User[]>(`${this.rootUrl}/user`);
  }

  promoteUser(userId: string) {
    return this.http.put(`${this.rootUrl}/user?_id=${userId}`, null);
  }

  deleteUser(userId: string) {
    return this.http.delete(`${this.rootUrl}/user?_id=${userId}`);
  }
}
