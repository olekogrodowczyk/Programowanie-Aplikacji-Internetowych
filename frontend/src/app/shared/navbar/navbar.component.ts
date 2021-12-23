import { Component, OnInit } from '@angular/core';
import { LoginFormComponent } from 'src/app/auth/login-form/login-form.component';
import { RegisterFormComponent } from 'src/app/auth/register-form/register-form.component';
import { AuthService } from 'src/app/auth/auth.service';
import { BehaviorSubject } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  showLoginModal = false;
  showRegisterModal = false;
  showNotification = false;
  signedIn$: BehaviorSubject<boolean>;
  notificationMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.signedIn$ = this.authService.signedin$;
  }

  ngOnInit(): void {
    console.log(this.signedIn$);
  }

  selectItem() {
    this.showLoginModal = true;
  }

  onLogged(value: boolean) {
    if (value === true) {
      this.notificationMessage = 'Pomyślnie zalogowano użytkownika';
    } else {
      this.notificationMessage = 'Podano błędne dane';
    }
    this.showLoginModal = false;
    this.showNotification = true;
    setTimeout(() => {
      this.showNotification = false;
    }, 3000);
  }

  onRegister(value: boolean) {
    if (value === true) {
      this.notificationMessage = 'Pomyślnie zalogowano użytkownika';
    } else {
      this.notificationMessage = 'Podano błędne dane';
    }
    this.showRegisterModal = false;
    this.showNotification = true;
    setTimeout(() => {
      this.showNotification = false;
    }, 3000);
  }

  onLogout() {
    this.authService.signout().subscribe({
      next: () => {
        this.notificationMessage = 'Pomyślnie wylogowano użytkownika';
      },
      error: ({ cause }) => {
        this.notificationMessage = 'Nastąpił błąd przy wylogowywaniu';
      },
      complete: () => {
        this.showNotification = true;
        setTimeout(() => {
          this.showNotification = false;
        }, 3000);
        this.router.navigate(['/home'], { relativeTo: this.route });
      },
    });
  }
}
