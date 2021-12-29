import { ValueConverter } from '@angular/compiler/src/render3/view/template';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
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
    private snackBar: SnackBarService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.recipientId = this.route.snapshot.queryParamMap.get('recipientId');
    console.log(this.recipientId);
    if (this.recipientId == null) {
      this.transactionsService.getAllTransactions().subscribe({
        next: (response) => {
          this.transactions = response;
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

  refresh(value: boolean) {
    if (value) {
      this.ngOnInit();
      this.snackBar.openSnackBar('Pomyślnie wpłacono podaną kwotę', 'OK');
    } else {
      this.snackBar.openSnackBar('Nie udało się wpłacić kwoty', 'OK');
    }
  }

  checkDepositPermission(roles: string[]): boolean {
    return this.authService.checkPermission(roles);
  }
}
