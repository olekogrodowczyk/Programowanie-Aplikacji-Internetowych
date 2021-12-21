import { Component, OnInit } from '@angular/core';
import { LoginFormComponent } from 'src/app/auth/login-form/login-form.component';
import { AuthService } from 'src/app/auth/auth.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  showLoginModal = false;
  signedIn$: BehaviorSubject<boolean>;
  constructor(private authService: AuthService) {
    this.signedIn$ = this.authService.signedin$;
  }

  ngOnInit(): void {}

  selectItem() {
    this.showLoginModal = true;
  }
}
