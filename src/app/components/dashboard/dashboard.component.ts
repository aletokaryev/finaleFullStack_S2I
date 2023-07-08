import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../auth/auth.service';
import Chart from 'chart.js/auto';

import { Router } from '@angular/router';

import { environment } from 'src/environment/environment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  API_URL = environment.API;

  expenses: any[] = [];
  categories: any[] = [];
  selectedCategory: string = '';
  amount: number = 0;
  description: string = 'Description goes here';

  pieChart!: Chart<'pie', number[], string>;

  @ViewChild('pieChart', { static: true }) pieChartRef!: ElementRef;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit() {
    this.fetchExpenses();
  }

  fetchExpenses() {
    // Recupera le categorie dal server
    this.http.get<any[]>(`${this.API_URL}/server/categories`)
      .subscribe(categories => {
        this.categories = categories;

        // Recupera le spese dell'utente loggato
        const userId = this.authService.getUserId();
        this.http.get<any[]>(`${this.API_URL}/server/expenses/${userId}`)
          .subscribe(expenses => {
            this.expenses = expenses.map(expense => {
              const category = this.categories.find(c => c._id === expense.categoryId);
              return { ...expense, categoryName: category ? category.name : 'Unknown Category' };
            });
            this.createPieChart();
          }, error => {
            console.error('Failed to fetch expenses', error);
          });
      }, error => {
        console.error('Failed to fetch categories', error);
      });
  }

  fetchCategories() {
    // Recupera le categorie dal server
    this.http.get<any[]>(`${this.API_URL}/server/categories`)
      .subscribe(categories => {
        this.categories = categories;
      }, error => {
        console.error('Failed to fetch categories', error);
      });
  }

  addExpense() {
    // Verifica se l'amount è zero
    if (this.amount === 0) {
      this.snackBar.open('Amount cannot be equal to zero.', 'Chiudi', {
        duration: 3000
      });
      return;
    }



    // Aggiungi una nuova spesa
    const userId = this.authService.getUserId();
    const category = this.categories.find(c => c.name === this.selectedCategory);
    if (!category || category === null) {
      console.error('Category not found', category);
      this.snackBar.open('You must select a category.', 'Chiudi', {
        duration: 3000
      });
      return;
    }

    this.http.post<any>(`${this.API_URL}/server/expenses`, {
      userId,
      categoryId: category._id,
      amount: this.amount,
      description: this.description
    }).subscribe(() => {
      this.fetchExpenses();
      this.createPieChart();
      this.resetForm();
    }, error => {
      console.error('Failed to add expense', error);
    });
  }

  deleteExpense(expenseId: string) {
    // Cancella una spesa
    this.http.delete(`${this.API_URL}/server/expenses/${expenseId}`)
      .subscribe(() => {
        this.fetchExpenses();
      }, error => {
        console.error('Failed to delete expense', error);
      });
  }

  resetForm() {
    this.selectedCategory = 'Other';
    this.amount = 0;
    this.description = 'Description goes here';
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  getTotalExpenses(): number {
    return this.expenses.reduce((total, expense) => total + expense.amount, 0);
  }


  createPieChart() {
    const categoryData: { [key: string]: number } = {};

    this.expenses.forEach(expense => {
      const categoryId = expense.categoryId;
      const amount = expense.amount;
      if (categoryData[categoryId]) {
        categoryData[categoryId] += amount;
      } else {
        categoryData[categoryId] = amount;
      }
    });

    const categories = Object.keys(categoryData);
    const data = categories.map(category => categoryData[category]);
    const categoryNames = categories.map(category => {
      const expense = this.expenses.find(expense => expense.categoryId === category);
      return expense ? expense.categoryName : 'Unknown Category';
    });
    const backgroundColors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'];

    // Distruggi il grafico esistente
    if (this.pieChart) {
      this.pieChart.destroy();
    }

    this.pieChart = new Chart<'pie', number[], string>(this.pieChartRef.nativeElement, {
      type: 'pie',
      data: {
        labels: categoryNames,
        datasets: [{
          data: data,
          backgroundColor: backgroundColors,
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: '#ffffff'
            }
          },
          title: {
            display: true,
            text: 'Expenses by category',
            color: '#ffffff'
          }
        }
      }
    });
  }
}
