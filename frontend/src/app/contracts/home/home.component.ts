import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { SnackBarService } from 'src/app/shared/snack-bar.service';
import { WebsocketService } from 'src/app/websocket.service';
import { ContractsService, Contract } from '../contracts.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  contractIdToDelete!: string;
  showAddContractModal = false;
  showDeleteContractModal = false;

  constructor(
    private snackBar: SnackBarService,
    public contractsService: ContractsService,
    private webSocketService: WebsocketService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getContracts();
    this.webSocketService.openWebSocket();
  }

  getContracts() {
    this.contractsService.getContracts().subscribe({
      next: (value) => {
        this.contractsService.contracts = value;
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

  payOff(contractId: string) {
    this.contractsService.payOff(contractId).subscribe({
      next: () => {
        this.snackBar.openSnackBar('Pomyślnie rozliczono umowę', 'OK');
        this.ngOnInit();
      },
      error: ({ cause }) => {
        this.snackBar.openSnackBar(
          'Wystąpił błąd podczas rozliczania umowy',
          'OK'
        );
      },
    });
    this.ngOnInit();
  }

  checkPermission(roles: string[]): boolean {
    return this.authService.checkPermission(roles);
  }

  onAddContractSubmit(value: boolean) {
    let notificationMessage = '';
    if (value === true) {
      notificationMessage = 'Pomyślnie dodano nową umowę';
    } else {
      notificationMessage = 'Podano błędne dane';
    }
    this.showAddContractModal = false;
    this.snackBar.openSnackBar(notificationMessage, 'Ok');
    this.ngOnInit();
  }

  onDeleteClick(contractId: string) {
    this.contractsService.deleteContract(contractId).subscribe({
      next: () => {
        this.snackBar.openSnackBar('Pomyślnie usunięto umowę', 'OK');
      },
      error: () => {
        this.snackBar.openSnackBar('Nie udało się usunąć umowy', 'OK');
      },
    });
    this.showDeleteContractModal = false;
    this.ngOnInit();
  }
}
