import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  rootUrl = 'localhost:7777';

  constructor() {}
}
