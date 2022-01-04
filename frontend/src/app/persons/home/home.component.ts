import { Component, OnInit, ViewChild } from '@angular/core';
import { Person, PersonsService } from '../persons.service';
import { AddPersonFormComponent } from '../add-person-form/add-person-form.component';
import { EditPersonComponent } from '../edit-person/edit-person.component';
import { SnackBarService } from 'src/app/shared/snack-bar.service';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  filterValue: string = '';
  persons: Person[] = [];
  personToEdit: Person = {} as Person;
  showAddPersonModal = false;
  showEditPersonModal = false;

  constructor(
    private personsService: PersonsService,
    private snackBar: SnackBarService,
    private authService: AuthService
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

  getFilterValue(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }

  afterFiltered(...params: string[]): boolean {
    let found: boolean = false;
    params.forEach((element: string) => {
      if (element.toLowerCase().search(this.filterValue.toLowerCase()) != -1) {
        found = true;
      }
    });
    return found;
  }

  onEditClick(person: Person) {
    this.personToEdit = person;
    this.showEditPersonModal = true;
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
    this.ngOnInit();
  }

  onEditPersonSubmit(value: boolean) {
    let notificationMessage = '';
    if (value === true) {
      notificationMessage = 'Pomyślnie edytowano osobę';
    } else {
      notificationMessage = 'Podano błędne dane';
    }
    this.showEditPersonModal = false;
    this.snackBar.openSnackBar(notificationMessage, 'OK');
    this.ngOnInit();
  }

  CheckAddPersonPermission(roles: string[]): boolean {
    return this.authService.checkPermission(roles);
  }
}
