import { Component, OnInit } from '@angular/core';
import { Person, PersonsService } from '../persons.service';
import { AddPersonFormComponent } from '../add-person-form/add-person-form.component';
import { NotificationComponent } from 'src/app/shared/notification/notification.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  showNotification = false;
  persons: Person[] = [];
  showAddPersonModal = false;
  notificationMessage = '';
  constructor(private personsService: PersonsService) {}

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
    if (value === true) {
      this.notificationMessage = 'Pomyślnie dodano osobę';
    } else {
      this.notificationMessage = 'Podano błędne dane';
    }
    this.showAddPersonModal = false;
    this.showNotification = true;
    setTimeout(() => {
      this.showNotification = false;
    }, 3000);
  }
}
