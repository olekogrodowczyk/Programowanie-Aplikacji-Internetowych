import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';

interface SigninCredentials {
  login: string;
  password: string;
}

interface SigninResponse {
  login: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  username = '';
  rootUrl = 'http://localhost:7777';
  signedin$ = new BehaviorSubject(false);

  constructor(private http: HttpClient) {}

  signIn(credentials: SigninCredentials) {
    return this.http
      .post<SigninResponse>(`${this.rootUrl}/auth`, credentials)
      .pipe(
        tap((response) => {
          this.signedin$.next(true);
          console.log(response.login);
          this.username = response.login;
        })
      );
  }
}
