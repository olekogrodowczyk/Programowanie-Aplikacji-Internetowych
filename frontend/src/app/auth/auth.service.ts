import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';

interface SigninCredentials {
  username: string;
  password: string;
}

interface SigninResponse {
  username: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  username = '';
  rootUrl = 'localhost:7777';
  signedin$ = new BehaviorSubject(false);

  constructor(private http: HttpClient) {}

  signIn(credentials: SigninCredentials) {
    return this.http
      .post<SigninResponse>(`${this.rootUrl}/auth`, credentials)
      .pipe(
        tap((response) => {
          this.signedin$.next(true);
          this.username = response.username;
        })
      );
  }
}
