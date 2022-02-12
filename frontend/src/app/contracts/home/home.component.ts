import { Component, OnDestroy, OnInit } from '@angular/core';
import { SnackBarService } from 'src/app/shared/snack-bar.service';
import { WebsocketService } from 'src/app/websocket.service';
import { ContractsService, Contract } from '../contracts.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {
  showAddContractModal = false;

  constructor(
    private snackBar: SnackBarService,
    public contractsService: ContractsService,
    private webSocketService: WebsocketService
  ) {}

  ngOnDestroy(): void {
    this.webSocketService.closeWebSocket();
  }

  ngOnInit(): void {
    this.webSocketService.openWebSocket();
    this.getContracts();
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
    this.ngOnInit();
  }
}
