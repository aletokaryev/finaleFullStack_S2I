import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { MatSnackBar } from '@angular/material/snack-bar';

import { HttpClientModule } from '@angular/common/http';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authService: AuthService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthGuard, AuthService, Router, MatSnackBar],
      imports: [HttpClientModule],
    });
    guard = TestBed.inject(AuthGuard);
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow access to the dashboard if the user is logged in', () => {
    spyOn(authService, 'isLoggedIn').and.returnValue(true);
    const navigateSpy = spyOn(router, 'navigate');

    const canActivate = guard.canActivate();

    expect(canActivate).toBe(true);
    expect(navigateSpy).not.toHaveBeenCalled();
  });

  it('should prevent access to the dashboard and redirect to login if the user is not logged in', () => {
    spyOn(authService, 'isLoggedIn').and.returnValue(false);
    const navigateSpy = spyOn(router, 'navigate');

    const canActivate = guard.canActivate();

    expect(canActivate).toBe(false);
    expect(navigateSpy).toHaveBeenCalledWith(['/login']);
  });
});
