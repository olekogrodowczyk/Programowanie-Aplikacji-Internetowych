import { Component, OnInit } from '@angular/core';
import { SnackBarService } from 'src/app/shared/snack-bar.service';
import { ContractsService, Contract } from '../contracts.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  showAddContractModal = false;
  contracts: Contract[] = [];
  constructor(
    private snackBar: SnackBarService,
    private contractsService: ContractsService
  ) {}

  ngOnInit(): void {
    this.getContracts();
  }

  getContracts() {
    this.contractsService.getContracts().subscribe({
      next: (value) => {
        this.contracts = value;
      },
      error: ({ cause }) => {
        this.snackBar.openSnackBar(
          'Wystąpił błąd podczas pobierania umów',
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
}
