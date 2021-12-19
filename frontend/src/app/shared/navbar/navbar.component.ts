import { Component, OnInit } from '@angular/core';
import { LoginFormComponent } from 'src/app/auth/login-form/login-form.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  showModal = false;
  constructor() {}

  ngOnInit(): void {}

  selectItem() {
    this.showModal = true;
  }
}
