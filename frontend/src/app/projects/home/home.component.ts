import { Component, OnInit } from '@angular/core';
import { SnackBarService } from 'src/app/shared/snack-bar.service';
import { UsersService } from 'src/app/users.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  showAddProjectModal = false;

  constructor(
    private snackBar: SnackBarService,
    private usersService: UsersService
  ) {}

  ngOnInit(): void {}

  onAddProjectSubmit(value: boolean) {
    let notificationMessage = '';
    if (value === true) {
      notificationMessage = 'Pomyślnie dodano osobę';
    } else {
      notificationMessage = 'Podano błędne dane';
    }
    this.showAddProjectModal = false;
    this.snackBar.openSnackBar(notificationMessage, 'Ok');
    this.ngOnInit();
  }
}
