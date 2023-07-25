import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, of } from 'rxjs';

import { environment } from 'src/environment/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  API_URL = environment.API;

  private isAuthenticated: boolean = false;
  private userId: string = '';
  private token: string = '';

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

  login() {
    return this.http.post<any>(`${this.API_URL}/auth/login`, { email: this.email, password: this.password })
      .pipe(
        map(res => {
          this.isAuthenticated = true;
          this.userId = res.user._id;
          this.token = res.token;
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
    this.token = '';
  }

  getToken(): string {
    return this.token;
  }

  register() {
    return this.http.post<any>(`${this.API_URL}/auth/register`, { fname: this.fname, lname: this.lname, email: this.email, password: this.password })
      .pipe(
        map(res => {
          this.isAuthenticated = true;
          this.fname = '';
          this.lname = '';
          this.email = '';
          this.password = '';
          this._snackBar.open("Account created successfully.", "Close", { duration: 2000, panelClass: 'success-snackbar' });
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

  // Metodo per ottenere le categorie dal server
  getCategories() {
    return this.http.get<any[]>(`${this.API_URL}/auth/users/${this.getUserId()}/categories`)
      .pipe(
        catchError(error => {
          console.error('Failed to fetch categories', error);
          return of([]);
        })
      );
  }

  // Metodo per ottenere le spese dell'utente loggato dal server
  getExpenses() {
    
    let head_obj;
    if (this.token) {
      head_obj = new HttpHeaders().set('Authorization', this.token);
    }
    
    console.log(this.getUserId());
    return this.http.get<any[]>(`${this.API_URL}/auth/users/${this.getUserId()}/expenses`, { headers: head_obj })
      .pipe(
        catchError(error => {
          console.error('Failed to fetch expenses', error);
          return of([]);
        })
      );
  }

  // Metodo per aggiungere una nuova spesa
  addExpense(categoryId: string, description: string, amount: number) {
    let head_obj;
    if (this.token) {
      head_obj = new HttpHeaders().set('Authorization', this.token);
    }

    return this.http.post<any>(`${this.API_URL}/auth/users/${this.getUserId()}/expenses`, { userId: this.getUserId(), categoryId, description, amount }, { headers: head_obj, })
      .pipe(
        map(() => {
          this._snackBar.open("Expense added successfully.", "Close", { duration: 2000, panelClass: 'success-snackbar' });
          return true;
        }),
        catchError(error => {
          const errorMessage = error && error.error && error.error.message ? error.error.message.toLowerCase() : 'unknown error';
          console.error('Failed to add expense', error);
          this._snackBar.open("Failed to add expense, " + errorMessage, "Close", { duration: 2000, panelClass: 'error-snackbar' });
          return of(false);
        })
      );
  }

  // Metodo per cancellare una spesa
  deleteExpense(expenseId: string) {
    let head_obj;
    if (this.token) {
      head_obj = new HttpHeaders().set('Authorization', this.token);
    }

    return this.http.delete(`${this.API_URL}/auth/users/${this.getUserId()}/expenses/${expenseId}`, { headers: head_obj, })
      .pipe(
        map(() => {
          this._snackBar.open("Expense deleted successfully.", "Close", { duration: 2000, panelClass: 'success-snackbar' });
          return true;
        }),
        catchError(error => {
          const errorMessage = error && error.error && error.error.message ? error.error.message.toLowerCase() : 'unknown error';
          console.error('Failed to delete expense', error);
          this._snackBar.open("Failed to delete expense, " + errorMessage, "Close", { duration: 2000, panelClass: 'error-snackbar' });
          return of(false);
        })
      );
  }
}
