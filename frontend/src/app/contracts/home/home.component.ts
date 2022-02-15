import { Component, OnDestroy, OnInit } from '@angular/core';
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
    private authService: AuthService
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
      error: ({ cause }) => {
        this.snackBar.openSnackBar(
          'Wystąpił błąd podczas pobierania umów',
          'OK'
        );
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
