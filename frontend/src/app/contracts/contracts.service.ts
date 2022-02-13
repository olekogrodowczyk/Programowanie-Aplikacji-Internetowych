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

export interface Contract {
  _id: string;
  name: string;
  payment: number;
  creationTime: string;
  manager: string;
  contractor: string;
  project: string;
  startTime: string;
  endTime: string;
  commited: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ContractsService {
  contracts!: Contract[];
  rootUrl = 'http://localhost:7777';
  constructor(private http: HttpClient) {}

  addContract(value: AddContractCredentials) {
    return this.http.post(`${this.rootUrl}/contract`, value);
  }

  getContracts() {
    return this.http.get<Contract[]>(`${this.rootUrl}/contract`);
  }

  payOff(contractId: string) {
    return this.http.put(
      `${this.rootUrl}/contract?contractId=${contractId}`,
      null
    );
  }

  deleteContract(contractId: string) {
    return this.http.delete(`${this.rootUrl}/contract?_id=${contractId}`);
  }
}
