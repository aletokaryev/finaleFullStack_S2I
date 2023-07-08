import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  fname: string = '';
  lname: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router, private _snackBar: MatSnackBar) {}

  register(): void {
    if (this.validateForm()) {
      this.authService.fname = this.fname;
      this.authService.lname = this.lname;
      this.authService.email = this.email;
      this.authService.password = this.password;

      this.authService.register().subscribe(
        () => {
          // Reindirizza l'utente alla pagina di login dopo il signup
          this.router.navigate(['/login']);
        },
        (error) => {
          console.error('Registration error: ', error);
          this._snackBar.open("Signup failed. " + error, "Close", { duration: 2000 });
        }
      );
    }
  }

  validateForm(): boolean {
    if (!this.fname || !this.lname || !this.email || !this.password || !this.confirmPassword) {
      console.error('Please fill in all fields.');
      this.errorMessage = 'Please fill in all fields.';
      this._snackBar.open("Signup failed, " + this.errorMessage, "Close", { duration: 2000 });
      return false;
    }

    if (!this.validateEmail(this.email)) {
      console.error('Please enter a valid email.');
      this.errorMessage = 'Please enter a valid email.';
      this._snackBar.open("Signup failed, " + this.errorMessage, "Close", { duration: 2000 });
      return false;
    }

    if (this.password !== this.confirmPassword) {
      console.error('Passwords do not match.');
      this.errorMessage = 'Passwords do not match.';
      this._snackBar.open("Signup failed, " + this.errorMessage, "Close", { duration: 2000 });
      return false;
    }

    if (!this.validatePassword(this.password)) {
      console.error('Please enter a valid password.');
      this.errorMessage = 'Please enter a valid password. Password must contain at least 8 characters, one uppercase letter, one number, and one symbol.';
      this._snackBar.open("Signup failed, " + this.errorMessage, "Close", { duration: 2000 });
      return false;
    }

    return true;
  }

  validateEmail(email: string): boolean {
    // Validazione dell'email utilizzando un'espressione regolare
    const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  }

  validatePassword(password: string): boolean {
    // Validazione della password utilizzando un'espressione regolare
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordPattern.test(password);
  }
}
