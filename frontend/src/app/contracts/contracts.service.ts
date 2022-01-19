import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

export interface AddContractCredentials {
  name: string;
  payment: string;
  contractorId: string;
  projectId: string;
  startTime: number;
  endTime: number;
}

@Injectable({
  providedIn: 'root',
})
export class ContractsService {
  rootUrl = 'http://localhost:7777';
  constructor(private http: HttpClient) {}

  addContract(value: AddContractCredentials) {
    return this.http.post(`${this.rootUrl}/contract`, value);
  }
}
