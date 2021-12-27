import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SnackBarService } from 'src/app/shared/snack-bar.service';
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
    private transactionsService: TransactionsService,
    private snackBar: SnackBarService
  ) {}

  ngOnInit(): void {
    this.recipientId = this.route.snapshot.queryParamMap.get('recipientId');
    console.log(this.recipientId);
    if (this.recipientId == null) {
      this.title = 'Wszystkie transakcje';
      this.transactionsService.getAllTransactions().subscribe({
        next: (response) => {
          this.transactions = response;
          this.showNotification();
        },
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
            this.showNotification();
          },
          error: () => {
            console.log('Unexpected error occurred');
          },
        });
    }
  }
  showNotification() {
    this.transactions.length > 0
      ? this.snackBar.openSnackBar('Pomyślnie pobrano transakcje', 'OK')
      : this.snackBar.openSnackBar('Nie znaleziono żadnych transakcji', 'OK');
  }
}
