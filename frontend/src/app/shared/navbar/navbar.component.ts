import { Component, OnInit } from '@angular/core';
import { LoginFormComponent } from 'src/app/auth/login-form/login-form.component';
import { RegisterFormComponent } from 'src/app/auth/register-form/register-form.component';
import { AuthService } from 'src/app/auth/auth.service';
import { BehaviorSubject } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { SnackBarService } from '../snack-bar.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  isActive = false;
  showLoginModal = false;
  showRegisterModal = false;
  signedIn$: BehaviorSubject<boolean>;
  username$: BehaviorSubject<string>;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: SnackBarService
  ) {
    this.signedIn$ = this.authService.signedin$;
    this.username$ = this.authService.username$;
  }

  ngOnInit(): void {
    console.log(this.signedIn$);
  }

  changeIsActive() {
    console.log(this.isActive);

    this.isActive = this.isActive ? false : true;
  }

  selectItem() {
    this.showLoginModal = true;
  }

  onLogged(value: boolean) {
    let notificationMessage = '';
    if (value === true) {
      notificationMessage = 'Pomyślnie zalogowano użytkownika';
    } else {
      notificationMessage = 'Podano błędne dane';
    }
    this.showLoginModal = false;
    this.snackBar.openSnackBar(notificationMessage, 'OK');
  }

  onRegister(value: boolean) {
    let notificationMessage = '';
    if (value === true) {
      notificationMessage = 'Pomyślnie zarejestrowano użytkownika';
    } else {
      notificationMessage = 'Podano błędne dane';
    }
    this.showRegisterModal = false;
    this.snackBar.openSnackBar(notificationMessage, 'OK');
  }

  onLogout() {
    let notificationMessage = '';
    this.authService.signout().subscribe({
      next: () => {
        notificationMessage = 'Pomyślnie wylogowano użytkownika';
      },
      error: ({ cause }) => {
        notificationMessage = 'Nastąpił błąd przy wylogowywaniu';
      },
      complete: () => {
        this.snackBar.openSnackBar(notificationMessage, 'OK');
        this.router.navigate(['/home'], { relativeTo: this.route });
      },
    });
  }

  checkPermissions(roles: string[]): boolean {
    return this.authService.checkPermission(roles);
  }
}
