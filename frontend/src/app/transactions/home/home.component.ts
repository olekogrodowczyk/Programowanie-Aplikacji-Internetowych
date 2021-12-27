import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  TransactionResponse,
  TransactionsService,
} from '../transactions.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  title: string = '';
  recipientId: string | null = '';
  person: string = '';
  transactions: TransactionResponse[] = [];
  constructor(
    private route: ActivatedRoute,
    private transactionsService: TransactionsService
  ) {}

  ngOnInit(): void {
    this.recipientId = this.route.snapshot.queryParamMap.get('recipientId');
    console.log(this.recipientId);
    if (this.recipientId == null) {
      this.title = 'Wszystkie tranzakcje';
      this.transactionsService.getAllTransactions().subscribe({
        next: (response) => (this.transactions = response),
        error: () => {
          console.log('Unexpected error occurred');
        },
      });
    } else {
      this.transactionsService
        .getTransactionsByRecipiendId(this.recipientId)
        .subscribe({
          next: (response) => {
            this.transactions = response;
          },
          error: () => {
            console.log('Unexpected error occurred');
          },
        });
    }
  }
}
