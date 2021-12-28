import { ValueConverter } from '@angular/compiler/src/render3/view/template';
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
  filterPersonValue: string = '';
  recipientId: string | null = '';
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
  getFilterPersonValue(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }

  afterFiltered(value: string): boolean {
    if (
      value.toLowerCase().search(this.filterPersonValue.toLowerCase()) != -1
    ) {
      return true;
    }
    return false;
  }

  showNotification() {
    this.transactions.length > 0
      ? this.snackBar.openSnackBar('Pomyślnie pobrano transakcje', 'OK')
      : this.snackBar.openSnackBar('Nie znaleziono żadnych transakcji', 'OK');
  }

  refresh(value: boolean) {
    console.log(value);
    if (value) {
      this.ngOnInit();
    }
  }
}
