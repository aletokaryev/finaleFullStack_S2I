import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AuthService } from './auth.service';
import { environment } from 'src/environment/environment';

describe('AuthService', () => {
  let authService: AuthService;
  let httpMock: HttpTestingController;
  let snackBar: MatSnackBar;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, HttpClientModule, BrowserAnimationsModule],
      providers: [AuthService, MatSnackBar],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });
    authService = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    snackBar = TestBed.inject(MatSnackBar);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(authService).toBeTruthy();
  });

  it('should return the login status', () => {
    authService['isAuthenticated'] = true;
    const isLoggedIn = authService.isLoggedIn();
    expect(isLoggedIn).toBeTrue();
  });

  it('should return the user ID', () => {
    authService['userId'] = '123';
    const userId = authService.getUserId();
    expect(userId).toBe('123');
  });

  it('should register successfully and display success message', () => {
    const mockResponse = { success: true };
    const snackBarOpenSpy = spyOn(snackBar, 'open');

    authService.register().subscribe((result) => {
      expect(result).toBeTrue();
      expect(authService['isAuthenticated']).toBeTrue();
      expect(authService.fname).toBe('');
      expect(authService.lname).toBe('');
      expect(authService.email).toBe('');
      expect(authService.password).toBe('');
      expect(snackBarOpenSpy).toHaveBeenCalledWith('Account created succesfully.', 'Close', {
        duration: 2000,
        panelClass: 'success-snackbar'
      });
    });

    const req = httpMock.expectOne(`${environment.API}/server/register`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should login successfully', () => {
    const mockResponse = { user: { _id: '123' } };

    authService.login().subscribe((result) => {
      expect(result).toBeTrue();
      expect(authService['isAuthenticated']).toBeTrue();
      expect(authService['userId']).toBe('123');
      expect(authService.email).toBe('');
      expect(authService.password).toBe('');
    });

    const req = httpMock.expectOne(`${environment.API}/server/login`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });


  it('should logout and reset authentication state and user ID', () => {
    authService['isAuthenticated'] = true;
    authService['userId'] = '123';
    authService.logout();
    expect(authService['isAuthenticated']).toBeFalse();
    expect(authService['userId']).toBe('');
  });
});
