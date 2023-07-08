// login.component.ts
import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router, private _snackBar: MatSnackBar) {}

  login(): void {
    if (this.validateForm()) {
      this.authService.email = this.email;
      this.authService.password = this.password;

      this.authService.login().subscribe(
        () => {
          // Reindirizza l'utente alla dashboard dopo il login
          this.router.navigate(['/dashboard']);
        },
        (error) => {
          console.error('Login error: ', error);
          this._snackBar.open("Login failed, " + error, "Close", { duration: 2000 });
        }
      );
    }
  }

  validateForm(): boolean {
    if (!this.email || !this.password) {
      console.error('Please fill in all fields.');
      this._snackBar.open("Login failed, Please fill in all fields.", "Close", { duration: 2000 });
      return false;
    }

    return true;
  }
}
