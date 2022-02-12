import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

export interface Person {
  _id: string;
  firstName: string;
  lastName: string;
  year: number;
  balance: string;
  transactions: string;
}

export interface addPersonCredentials {
  firstName: string;
  lastName: string;
  year: number;
}

export interface editPersonCredentials {
  _id: string;
  firstName: string;
  lastName: string;
  year: number;
}

@Injectable({
  providedIn: 'root',
})
export class PersonsService {
  persons!: Person[];
  rootUrl = 'http://localhost:7777';
  constructor(private http: HttpClient) {}

  getPersons() {
    return this.http.get<Person[]>(`${this.rootUrl}/person`);
  }

  addPerson(credentials: addPersonCredentials) {
    return this.http.post(`${this.rootUrl}/person`, credentials);
  }

  editPerson(credentials: editPersonCredentials) {
    return this.http.put(`${this.rootUrl}/person`, credentials);
  }

  getPersonById(personId: string) {
    return this.http.get<Person>(`${this.rootUrl}/person?_id=${personId}`);
  }

  deletePerson(personId: string) {
    return this.http.delete(`${this.rootUrl}/person?_id=${personId}`);
  }
}
