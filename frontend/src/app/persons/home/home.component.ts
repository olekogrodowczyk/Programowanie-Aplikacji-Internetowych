import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Person, PersonsService } from '../persons.service';
import { AddPersonFormComponent } from '../add-person-form/add-person-form.component';
import { EditPersonComponent } from '../edit-person/edit-person.component';
import { SnackBarService } from 'src/app/shared/snack-bar.service';
import { AuthService } from 'src/app/auth/auth.service';
import { WebsocketService } from 'src/app/websocket.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  filterValue: string = '';
  personToEdit: Person = {} as Person;
  personIdToDelete!: string;
  showAddPersonModal = false;
  showEditPersonModal = false;
  showDeletePersonModal = false;

  constructor(
    public personsService: PersonsService,
    private snackBar: SnackBarService,
    private authService: AuthService,
    private webSocketService: WebsocketService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getPersons();
    this.webSocketService.openWebSocket();
  }

  getPersons() {
    this.personsService.getPersons().subscribe({
      next: (response) => {
        this.personsService.persons = response;
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

  onDeleteClick(personId: string) {
    this.personsService.deletePerson(personId).subscribe({
      next: () => {
        this.ngOnInit();
        this.snackBar.openSnackBar('Pomyślnie usunięto osobę', 'OK');
      },
      error: () => {
        this.snackBar.openSnackBar('Nie udało się usunąć osoby', 'OK');
      },
    });
    this.showDeletePersonModal = false;
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
