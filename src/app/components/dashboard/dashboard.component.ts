// Import delle dipendenze
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import Chart from 'chart.js/auto';

import { AuthService } from '../../auth/auth.service';

import { environment } from 'src/environment/environment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  // URL dell'API
  API_URL = environment.API;

  // Variabili per gestire le spese e le categorie
  expenses: any[] = [];
  categories: any[] = [];
  selectedCategory: string = '';
  amount: number = 0;
  description: string = '';

  // Riferimento al grafico a torta
  pieChart!: Chart<'pie', number[], string>;
  @ViewChild('pieChart', { static: true }) pieChartRef!: ElementRef;

  constructor(
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit() {
    // Verifica se l'utente è autenticato, altrimenti reindirizza alla pagina di login
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    // Inizializzazione: recupera le categorie e le spese
    this.fetchCategories();
    this.fetchExpenses();
  }

    // Metodo per ottenere il nome della categoria data la sua ID
    getCategoryName(categoryId: string): string {
      const category = this.categories.find(c => c._id === categoryId);
      return category ? category.name : 'Unknown Category';
    }

  logout() {
    // Esegui il logout e reindirizza alla pagina di login
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  getTotalExpenses(): number {
    // Calcola la somma totale delle spese
    return this.expenses.reduce((total, expense) => total + expense.amount, 0);
  }

  fetchCategories() {
    // Recupera le categorie dal server
    this.authService.getCategories().subscribe(
      (categories) => {
        this.categories = categories;
        if (this.categories.length > 0) {
          this.selectedCategory = this.categories[0]._id;
        }
      },
      (error) => {
        console.error('Error fetching categories:', error);
        this.snackBar.open('Failed to fetch categories', 'Close', { duration: 2000, panelClass: 'error-snackbar' });
      }
    );
  }

  fetchExpenses() {
    // Recupera le spese dell'utente dal server
    this.authService.getExpenses().subscribe(
      (expenses) => {
        this.expenses = expenses;
        this.updatePieChart();
      },
      (error) => {
        console.error('Error fetching expenses:', error);
        this.snackBar.open('Failed to fetch expenses', 'Close', { duration: 2000, panelClass: 'error-snackbar' });
      }
    );
  }

  addExpense() {
    // Aggiunge una nuova spesa
    this.authService.addExpense(this.selectedCategory, this.description, this.amount).subscribe(
      () => {
        this.fetchExpenses();
        this.amount = 0;
        this.description = '';
      },
      () => {}
    );
  }

  deleteExpense(expenseId: string) {
    // Cancella una spesa esistente
    this.authService.deleteExpense(expenseId).subscribe(
      () => {
        this.fetchExpenses();
      },
      () => {}
    );
  }

  updatePieChart() {
    // Aggiorna il grafico a torta
    if (this.pieChart) {
      this.pieChart.destroy();
    }

    const categoryLabels: string[] = [];
    const categoryAmounts: number[] = [];

    this.categories.forEach((category) => {
      const categoryId = category._id;
      const categoryLabel = category.name;
      const categoryExpenses = this.expenses.filter((expense) => expense.categoryId === categoryId);
      const totalAmount = categoryExpenses.reduce((acc, expense) => acc + expense.amount, 0);
      categoryLabels.push(categoryLabel);
      categoryAmounts.push(totalAmount);
    });

    this.pieChart = new Chart(this.pieChartRef.nativeElement, {
      type: 'pie',
      data: {
        labels: categoryLabels,
        datasets: [
          {
            data: categoryAmounts,
            backgroundColor: [
              '#FF6384',
              '#36A2EB',
              '#FFCE56',
              '#66BB6A',
              '#FF8A65',
              '#9575CD',
              '#26A69A',
              '#D4E157',
              '#78909C',
              '#FDD835'
            ],
            hoverBackgroundColor: [
              '#FF6384',
              '#36A2EB',
              '#FFCE56',
              '#66BB6A',
              '#FF8A65',
              '#9575CD',
              '#26A69A',
              '#D4E157',
              '#78909C',
              '#FDD835'
            ]
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }
}
