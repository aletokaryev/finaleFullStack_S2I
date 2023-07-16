import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of } from 'rxjs';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { HttpClientModule } from '@angular/common/http';

import { LoginComponent } from './login.component';
import { AuthService } from '../auth.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: AuthService;
  let router: Router;
  let snackBar: MatSnackBar;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: jasmine.createSpyObj('AuthService', ['login']) },
        { provide: Router, useValue: jasmine.createSpyObj('Router', ['navigate']) },
        { provide: MatSnackBar, useValue: jasmine.createSpyObj('MatSnackBar', ['open']) }
      ],
      imports:[HttpClientModule],
      schemas:[CUSTOM_ELEMENTS_SCHEMA]
    });
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    snackBar = TestBed.inject(MatSnackBar);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should login and navigate to dashboard on successful login', () => {
    // Simula un successo nel login
    (authService.login as jasmine.Spy).and.returnValue(of(true));

    component.email = 'test@example.com';
    component.password = 'Password1!';

    component.login();

    expect(authService.login).toHaveBeenCalled();
    expect(authService.email).toBe('test@example.com');
    expect(authService.password).toBe('Password1!');
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should validate form', () => {
    component.email = 'test@example.com';
    component.password = 'Password1!';
    expect(component.validateForm()).toBeTrue();

    component.email = '';
    component.password = 'Password1!';
    expect(component.validateForm()).toBeFalse();

    component.email = 'test@example.com';
    component.password = '';
    expect(component.validateForm()).toBeFalse();
  });
});
