import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SnackBarService } from 'src/app/shared/snack-bar.service';
import { WebsocketService } from 'src/app/websocket.service';
import { User, UsersService } from '../users.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  userIdToDelete!: string;
  userIdToPromote!: string;
  showDeleteUserModal: boolean = false;
  showPromoteUserModal: boolean = false;
  filterValue: string = '';
  constructor(
    public usersService: UsersService,
    private webSocketService: WebsocketService,
    private snackBarService: SnackBarService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.webSocketService.openWebSocket();
    this.getUsers();
  }

  getUsers() {
    this.usersService.getUsers().subscribe({
      next: (response) => {
        this.usersService.users = response;
      },
      error: (response) => {
        console.log(response);
        if (response?.status == 403) {
          this.snackBarService.openSnackBar('Brak uprawnień!', 'OK');
          this.router.navigateByUrl('/');
        }
      },
    });
  }

  onPromoteClick(userId: string) {
    this.usersService.promoteUser(userId).subscribe({
      next: () => {
        this.snackBarService.openSnackBar(
          'Pomyślnie awansowano użytkownika do roli kierownika',
          'OK'
        );
      },
      error: () => {
        this.snackBarService.openSnackBar(
          'Nastąpił błąd podczas awansowania użytkownka',
          'OK'
        );
      },
    });
    this.showPromoteUserModal = false;
    this.getUsers();
    this.ngOnInit();
  }

  onDeleteClick(userId: string) {
    this.usersService.deleteUser(userId).subscribe({
      next: () => {
        this.snackBarService.openSnackBar(
          'Pomyślnie usunięto użytkownika',
          ' OK'
        );
      },
      error: () => {
        this.snackBarService.openSnackBar(
          'Nastąpił błąd podczas usuwania użytkownika',
          'OK'
        );
      },
    });
    this.showDeleteUserModal = false;
    this.getUsers();
    this.ngOnInit();
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

  getUserMaxRole(user: User): string {
    if (user.roles.includes('admin')) {
      return 'Admin';
    } else if (user.roles.includes('manager')) {
      return 'Kierownik';
    } else if (user.roles.includes('user')) {
      return 'Użytkownik';
    } else {
      return 'Niezdefiniowane';
    }
  }
}
