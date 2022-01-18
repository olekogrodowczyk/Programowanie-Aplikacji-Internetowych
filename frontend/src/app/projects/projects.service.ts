import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

export interface AddProjectCredentials {
  name: string;
  managerId: string;
}

export interface EditProjectCredentials {
  _id: string;
  name: string;
  managerId: string;
}

export interface Project {
  _id: string;
  name: string;
  creator: string;
  manager: string;
  timeCreation: Date;
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

  editProject(credentials: AddProjectCredentials) {
    return this.http.put(`${this.rootUrl}/project`, credentials);
  }

  getProjects() {
    return this.http.get<Project[]>(`${this.rootUrl}/project`);
  }
}
