import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

export interface AddProjectCredentials {
  name: string;
  managerId: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  rootUrl = 'http://localhost:7777';
  constructor(private http: HttpClient) {}

  addProject(credentials: AddProjectCredentials) {
    return this.http.post(`${this.rootUrl}/project`, credentials);
  }
}
