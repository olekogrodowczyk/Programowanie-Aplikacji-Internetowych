import { Component, OnInit } from '@angular/core';

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
