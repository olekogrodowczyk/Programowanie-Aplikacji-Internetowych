import { ValueConverter } from '@angular/compiler/src/render3/view/template';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { SnackBarService } from 'src/app/shared/snack-bar.service';
import { WebsocketService } from 'src/app/websocket.service';
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

  constructor(
    private route: ActivatedRoute,
    public transactionsService: TransactionsService,
    private snackBar: SnackBarService,
    private authService: AuthService,
    private webSocketService: WebsocketService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.webSocketService.openWebSocket();
    this.recipientId = this.route.snapshot.queryParamMap.get('recipientId');
    if (this.recipientId) {
      this.getTransactionByRecipientId();
    } else {
      this.getAllTransactions();
    }
  }

  getAllTransactions() {
    this.transactionsService.getAllTransactions().subscribe({
      next: (response) => {
        this.transactionsService.transactions = response;
      },
      error: (response) => {
        console.log(response);
        if (response?.status == 403) {
          this.snackBar.openSnackBar('Brak uprawnień!', 'OK');
          this.router.navigateByUrl('/');
        }
      },
    });
  }

  getTransactionByRecipientId() {
    console.log(this.recipientId);

    this.transactionsService
      .getTransactionsByRecipiendId(this.recipientId!)
      .subscribe({
        next: (response) => {
          this.transactionsService.transactions = response;
        },
        error: (response) => {
          console.log(response);
          if (response?.status == 403) {
            this.snackBar.openSnackBar('Brak uprawnień!', 'OK');
            this.router.navigateByUrl('/');
          }
        },
      });
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
      this.getAllTransactions();
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
