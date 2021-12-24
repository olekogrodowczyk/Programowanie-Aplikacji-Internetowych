import { Component, OnInit } from '@angular/core';
import { Person, PersonsService } from '../persons.service';
import { AddPersonFormComponent } from '../add-person-form/add-person-form.component';
import { NotificationComponent } from 'src/app/shared/notification/notification.component';
import { SnackBarService } from 'src/app/shared/snack-bar.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  persons: Person[] = [];
  showAddPersonModal = false;
  constructor(
    private personsService: PersonsService,
    private snackBar: SnackBarService
  ) {}

  ngOnInit(): void {
    this.personsService.getPersons().subscribe({
      next: (response) => {
        this.persons = response;
      },
      error: () => {
        console.log('Error caught!');
      },
    });
  }

  onAddPersonSubmit(value: boolean) {
    let notificationMessage = '';
    if (value === true) {
      notificationMessage = 'Pomyślnie dodano osobę';
    } else {
      notificationMessage = 'Podano błędne dane';
    }
    this.showAddPersonModal = false;
    this.snackBar.openSnackBar(notificationMessage, 'Ok');
  }
}
