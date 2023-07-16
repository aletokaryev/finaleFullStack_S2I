import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { Chart } from 'chart.js';
import { environment } from 'src/environment/environment';

import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';

import { DashboardComponent } from './dashboard.component';
import { AuthService } from '../../auth/auth.service';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let authService: AuthService;
  let snackBar: MatSnackBar;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DashboardComponent],
      imports: [HttpClientTestingModule, RouterTestingModule, HttpClientModule, FormsModule, MatTableModule, BrowserAnimationsModule],
      providers: [AuthService, MatSnackBar, HttpClient]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    snackBar = TestBed.inject(MatSnackBar);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch expenses on initialization', () => {
    const fetchExpensesSpy = spyOn(component, 'fetchExpenses');
    component.ngOnInit();
    expect(fetchExpensesSpy).toHaveBeenCalled();
  });

  it('should add an expense', () => {
    const category = { _id: '1', name: 'Category 1' };
    const expense = { _id: '1', categoryId: '1', amount: 10, description: 'Expense 1' };
    const postExpenseSpy = spyOn(component['http'], 'post').and.returnValue(of(expense));
    const fetchExpensesSpy = spyOn(component, 'fetchExpenses');
    const createPieChartSpy = spyOn(component, 'createPieChart');
    const resetFormSpy = spyOn(component, 'resetForm');

    component.categories = [category];
    component.selectedCategory = category.name;
    component.amount = expense.amount;
    component.description = expense.description;

    component.addExpense();

    expect(postExpenseSpy).toHaveBeenCalledWith(`${component.API_URL}/server/expenses`, {
      userId: authService.getUserId(),
      categoryId: category._id,
      amount: expense.amount,
      description: expense.description
    });
    expect(fetchExpensesSpy).toHaveBeenCalled();
    expect(createPieChartSpy).toHaveBeenCalled();
    expect(resetFormSpy).toHaveBeenCalled();
  });


  it('should delete an expense', () => {
    const expenseId = '1';
    const deleteExpenseSpy = spyOn(component['http'], 'delete').and.returnValue(of(null));
    const fetchExpensesSpy = spyOn(component, 'fetchExpenses');

    component.deleteExpense(expenseId);

    expect(deleteExpenseSpy).toHaveBeenCalledWith(`${component.API_URL}/server/expenses/${expenseId}`);
    expect(fetchExpensesSpy).toHaveBeenCalled();
  });

  it('should reset the form', () => {
    component.selectedCategory = 'Category';
    component.amount = 10;
    component.description = 'Expense';

    component.resetForm();

    expect(component.selectedCategory).toBe('Other');
    expect(component.amount).toBe(0);
    expect(component.description).toBe('Description goes here');
  });

  it('should logout and navigate to login', () => {
    const logoutSpy = spyOn(authService, 'logout');
    const navigateSpy = spyOn(component['router'], 'navigate');

    component.logout();

    expect(logoutSpy).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith(['/login']);
  });

  it('should calculate the total expenses', () => {
    component.expenses = [
      { _id: '1', categoryId: '1', amount: 10, description: 'Expense 1' },
      { _id: '2', categoryId: '2', amount: 20, description: 'Expense 2' }
    ];

    const totalExpenses = component.getTotalExpenses();

    expect(totalExpenses).toBe(30);
  });
});
