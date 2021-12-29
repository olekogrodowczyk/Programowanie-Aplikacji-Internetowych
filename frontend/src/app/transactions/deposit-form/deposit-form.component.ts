import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Person, PersonsService } from 'src/app/persons/persons.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TransactionsService } from '../transactions.service';
import { SnackBarService } from 'src/app/shared/snack-bar.service';

@Component({
  selector: 'app-deposit-form',
  templateUrl: './deposit-form.component.html',
  styleUrls: ['./deposit-form.component.css'],
})
export class DepositFormComponent implements OnInit {
  @Output() isDone = new EventEmitter<boolean>();

  depositForm = new FormGroup({
    recipient: new FormControl(''),
    amount: new FormControl('', Validators.required),
  });
  persons: Person[] = [];
  constructor(
    private personsService: PersonsService,
    private transactionsService: TransactionsService,
    private snackBar: SnackBarService
  ) {}

  ngOnInit(): void {
    this.personsService.getPersons().subscribe({
      next: (response) => {
        this.persons = response;
      },
      error: () => {
        console.log('Unexpected error occurred');
      },
    });
  }

  onSubmit() {
    if (!this.depositForm.valid) {
      return false;
    }
    if (this.depositForm.value.recipient[0] === undefined) {
      this.snackBar.openSnackBar('Nie wybrano adresata wpłaty', 'OK');
      return false;
    }
    let newFormValue = {
      amount: this.depositForm.value.amount,
      recipient: this.depositForm.value.recipient[0]._id,
    };
    this.transactionsService.sendDeposit(newFormValue).subscribe({
      next: () => {
        this.isDone.emit(true);
      },
      error: () => {
        this.isDone.emit(false);
      },
    });
    return true;
  }
}
