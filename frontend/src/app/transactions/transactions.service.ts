import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface TransactionResponse {
  _id: string;
  recipientId: string;
  recipientName: string;
  amount: number;
  when: number;
}

export interface DepositRequest {
  recipient: string;
  amount: number;
}

@Injectable({
  providedIn: 'root',
})
export class TransactionsService {
  transactions!: TransactionResponse[];
  rootUrl = 'http://localhost:7777';
  constructor(private http: HttpClient) {}

  getAllTransactions() {
    return this.http.get<TransactionResponse[]>(`${this.rootUrl}/transaction`);
  }

  getTransactionsByRecipiendId(recipientId: string) {
    return this.http.get<TransactionResponse[]>(
      `${this.rootUrl}/transaction?recipientId=${recipientId}`
    );
  }

  sendDeposit(payload: DepositRequest) {
    return this.http.post<TransactionResponse>(
      `${this.rootUrl}/deposit`,
      payload
    );
  }
}
