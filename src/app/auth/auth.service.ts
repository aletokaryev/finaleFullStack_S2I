import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import { catchError, map, of } from 'rxjs';

import { environment } from 'src/environment/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  API_URL = environment.API;

  private isAuthenticated: boolean = false;
  private userId: string = '';

  fname: string = '';
  lname: string = '';

  email: string = '';
  password: string = '';

  message: string = '';

  constructor(private http: HttpClient, private _snackBar: MatSnackBar) {}

  isLoggedIn(): boolean {
    return this.isAuthenticated;
  }

  getUserId(): string {
    return this.userId;
  }

  register() {
    return this.http.post<any>(`${this.API_URL}/server/register`, { fname: this.fname, lname: this.lname, email: this.email, password: this.password })
      .pipe(
        map(res => {
          this.isAuthenticated = true;
          this.fname = '';
          this.lname = '';
          this.email = '';
          this.password = '';
          this._snackBar.open("Account created succesfully.", "Close", { duration: 2000, panelClass: 'success-snackbar' });
          return true;
        }),
        catchError(error => {
          const errorMessage = error && error.error && error.error.message ? error.error.message.toLowerCase() : 'unknown error';
          console.error('Signup error: ', errorMessage);
          this._snackBar.open("Signup failed, " + errorMessage, "Close", { duration: 2000, panelClass: 'error-snackbar' });
          return of(false);
        })
      );
  }

  login() {
    return this.http.post<any>(`${this.API_URL}/server/login`, { email: this.email, password: this.password })
      .pipe(
        map(res => {
          this.isAuthenticated = true;
          this.userId = res.user._id;
          this.email = '';
          this.password = '';
          return true;
        }),
        catchError(error => {
          const errorMessage = error && error.error && error.error.message ? error.error.message.toLowerCase() : 'unknown error';
          console.error('Login error: ', errorMessage);
          this._snackBar.open("Login failed, " + errorMessage, "Close", { duration: 2000, panelClass: 'error-snackbar' });
          return of(false);
        })
      );
  }

  logout(): void {
    this.isAuthenticated = false;
    this.userId = '';
  }
}
