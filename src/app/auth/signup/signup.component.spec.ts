import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { SignupComponent } from './signup.component';
import { AuthService } from '../auth.service';

import { HttpClientModule } from '@angular/common/http';
describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;
  let authService: AuthService;
  let router: Router;
  let snackBar: MatSnackBar;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SignupComponent],
      providers: [
        { provide: AuthService, useValue: jasmine.createSpyObj('AuthService', ['register']) },
        { provide: Router, useValue: jasmine.createSpyObj('Router', ['navigate']) },
        { provide: MatSnackBar, useValue: jasmine.createSpyObj('MatSnackBar', ['open']) }
      ],
      imports: [HttpClientModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });
    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    snackBar = TestBed.inject(MatSnackBar);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should register user and navigate to login on successful signup', () => {
    // Simula un successo nella registrazione
    (authService.register as jasmine.Spy).and.returnValue(of(true));

    component.fname = 'John';
    component.lname = 'Doe';
    component.email = 'john@example.com';
    component.password = 'Password1!';
    component.confirmPassword = 'Password1!';

    component.register();

    expect(authService.register).toHaveBeenCalled();
    expect(authService.fname).toBe('John');
    expect(authService.lname).toBe('Doe');
    expect(authService.email).toBe('john@example.com');
    expect(authService.password).toBe('Password1!');
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should validate email using regular expression', () => {
    expect(component.validateEmail('test@example.com')).toBeTrue();
    expect(component.validateEmail('invalidemail')).toBeFalse();
  });

  it('should validate password using regular expression', () => {
    expect(component.validatePassword('Password1!')).toBeTrue();
    expect(component.validatePassword('password')).toBeFalse();
  });
});
