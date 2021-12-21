import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';

interface SignupCredentials {
  login: string;
  password: string;
  passwordConfirm: string;
}

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

  signUp(credentials: SignupCredentials) {
    return this.http.post(`${this.rootUrl}/register`, credentials).pipe(
      tap(() => {
        this.signedin$.next(true);
      })
    );
  }
}
