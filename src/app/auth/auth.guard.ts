import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isLoggedIn()) {
      return true; // L'utente è autenticato, permetti l'accesso alla dashboard
    } else {
      this.router.navigate(['/login']); // Reindirizza l'utente alla pagina di login
      return false; // Impedisce l'accesso alla dashboard
    }
  }
}
