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

interface CheckAuthResponse {
  isAuth: boolean;
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

  checkAuth() {
    return this.http.get<CheckAuthResponse>(`${this.rootUrl}/auth`).pipe(
      tap((response) => {
        console.log(`Outcome of checkAuth() - ${response}`);
        this.signedin$.next(response.isAuth);
      })
    );
  }
}
