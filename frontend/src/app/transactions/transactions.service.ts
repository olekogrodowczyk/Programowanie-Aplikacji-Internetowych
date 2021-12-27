import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Person, PersonsService } from '../persons/persons.service';
import { map, tap } from 'rxjs';

export interface TransactionResponse {
  recipientId: string;
  recipientName: string;
  amount: number;
  when: number;
}

@Injectable({
  providedIn: 'root',
})
export class TransactionsService {
  rootUrl = 'http://localhost:7777';
  constructor(
    private http: HttpClient,
    private personService: PersonsService
  ) {}

  getAllTransactions() {
    return this.http.get<TransactionResponse[]>(`${this.rootUrl}/transaction`);
  }

  getTransactionsByRecipiendId(recipientId: string) {
    return this.http.get<TransactionResponse[]>(
      `${this.rootUrl}/transaction?recipientId=${recipientId}`
    );
  }
}
