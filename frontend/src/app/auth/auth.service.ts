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
  roles: string[];
  firstName: string;
  lastName: string;
}

interface CheckAuthResponse {
  isAuth: boolean;
  roles: string[];
  login: string;
  firstName: string;
  lastName: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  roles$ = new BehaviorSubject<string[]>([]);
  username$ = new BehaviorSubject<string>('');
  rootUrl = 'http://localhost:7777';

  signedin$ = new BehaviorSubject(false);

  constructor(private http: HttpClient) {}

  signIn(credentials: SigninCredentials) {
    return this.http
      .post<SigninResponse>(`${this.rootUrl}/auth`, credentials)
      .pipe(
        tap((response) => {
          this.signedin$.next(true);
          this.username$.next(response.firstName + ' ' + response.lastName);
          this.roles$.next(response.roles);
        })
      );
  }

  signUp(credentials: SignupCredentials) {
    return this.http.post(`${this.rootUrl}/register`, credentials).pipe(
      tap(() => {
        this.signedin$.next(false);
      })
    );
  }

  checkPermission(roles: string[]): boolean {
    let exists: boolean = false;
    let userRoles = this.roles$.getValue();
    roles.forEach((item) => {
      if (userRoles.includes(item)) {
        exists = true;
      }
    });
    return exists;
  }

  checkAuth() {
    return this.http.get<CheckAuthResponse>(`${this.rootUrl}/auth`).pipe(
      tap((response) => {
        console.log(`Outcome of checkAuth() - ${response}`);
        this.signedin$.next(response.isAuth);
        this.roles$.next(response.roles);
        this.username$.next(
          (response.firstName + ' ' + response.lastName).trim()
        );
      })
    );
  }

  signout() {
    return this.http.delete(`${this.rootUrl}/auth`).pipe(
      tap(() => {
        this.signedin$.next(false);
        this.username$.next('');
      })
    );
  }
}
