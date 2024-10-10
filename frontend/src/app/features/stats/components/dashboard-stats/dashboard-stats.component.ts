import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { CommonModule } from '@angular/common';
import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { AuthService } from '../../../authentication/services/auth.service';
import { Router } from '@angular/router';
import { DashboardStats } from '../../interfaces/dashboartStats';
import { LowStockProduct } from '../../interfaces/lowstock';
import { DashboardStatsService } from '../../services/dashboard-stats.service';
import { SaleDetails } from '../../interfaces/sales';
import { FormsModule } from '@angular/forms';


// Enregistrer tous les éléments nécessaires de Chart.js
Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard-stats.component.html',
  styleUrls: ['./dashboard-stats.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})

export class DashboardStatsComponent implements OnInit {
  stats: DashboardStats | null = null;
  monthlyChart: Chart | undefined;
  categoryChart: Chart | undefined;
  lowStockProducts: LowStockProduct[] = [];
  salesDetails: SaleDetails[] = [];
  totalSales: number = 0;

  isLowStockModalOpen = false;
  isSalesModalOpen = false;

  filteredSales: any[] = [];  // Les ventes filtrées à afficher
  startDate: string = "";  // Date de début pour le filtre
  endDate: string = "";    // Date de fin pour le filtre



  constructor(private dashboardService: DashboardStatsService,
    private dialog: Dialog,
    private authServive: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.calculateTotalSales();
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.dashboardService.getDashboardStats().subscribe(
      (data: DashboardStats) => {
        this.stats = data;
        this.initializeCharts();
      },
      error => {
        console.error('Erreur lors du chargement des données du tableau de bord:', error);
      }
    );
  }

  showLowStockProducts() {
    this.dashboardService.getLowStockProducts().subscribe(
      (products: LowStockProduct[]) => {
        this.lowStockProducts = products;
        this.isLowStockModalOpen = true;
      }
    );
  }

  closeLowStockModal() {
    this.isLowStockModalOpen = false;
  }

  showTotalSales() {
      this.isSalesModalOpen = true;
  }

  
  closeSalesModal() {
    this.isSalesModalOpen = false;
  }

  // Fonction pour calculer le total des ventes
  calculateTotalSales() {
    this.dashboardService.getSalesDetails().subscribe({
      next: (data) => {
        this.salesDetails = data;
        this.filteredSales = data;  // Initialement, toutes les ventes sont affichées
        this.totalSales = this.salesDetails.reduce((total, sale) => {
          return total + sale.total_sales; // Calculer le total des ventes
        }, 0);        
      },
      error: (error) => {
        console.error('Erreur lors du chargement des ventes:', error);
      }
    }); 
  }



  // Méthode de filtrage des ventes par date
  filterSales() {
    const start = new Date(this.startDate);
    const end = new Date(this.endDate);

    if (this.startDate && this.endDate) {
      // Filtrer les ventes par date
      this.filteredSales = this.salesDetails.filter(sale => {
        const saleDate = new Date(sale.last_sale_date);
        return saleDate >= start && saleDate <= end;
      });
    } else {
      // Si aucune date n'est sélectionnée, afficher toutes les ventes
      this.filteredSales = this.salesDetails;
    }
  }

  getTotalFilteredSales(): number {
    return this.filteredSales.reduce((acc, sale) => acc + sale.total_sales, 0);
  }
  

  private initializeCharts() {
    if (this.stats) {
      // Détruire les graphiques existants s'ils existent
      if (this.monthlyChart) {
        this.monthlyChart.destroy();
      }
      if (this.categoryChart) {
        this.categoryChart.destroy();
      }

      // Monthly Sales Chart
      const monthlyCtx = document.getElementById('monthlyChart') as HTMLCanvasElement;
      this.monthlyChart = new Chart(monthlyCtx, {
        type: 'line',
        data: {
          labels: this.stats.monthly_sales.map(item => item.month),
          datasets: [{
            label: 'Ventes Mensuelles',
            data: this.stats.monthly_sales.map(item => item.sales),
            borderColor: '#8884d8',
            tension: 0.1,
            fill: false
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              type: 'linear'
            },
            x: {
              type: 'category'
            }
          },
          plugins: {
            legend: {
              display: true
            }
          }
        }
      });

      // Category Sales Chart
      const categoryCtx = document.getElementById('categoryChart') as HTMLCanvasElement;
      this.categoryChart = new Chart(categoryCtx, {
        type: 'bar',
        data: {
          labels: this.stats.sales_by_category.map(item => item.name_category),
          datasets: [{
            label: 'Ventes par Catégorie',
            data: this.stats.sales_by_category.map(item => item.total_sales),
            backgroundColor: '#82ca9d'
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              type: 'linear'
            },
            x: {
              type: 'category'
            }
          },
          plugins: {
            legend: {
              display: true
            }
          }
        }
      });
    }
  }

  formatToFCFA(value: number): string {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', minimumFractionDigits: 0 })
      .format(value);  // Retirer 'XOF' et ajouter ' FCFA'
  }
  

  // Nettoyer les graphiques lors de la destruction du composant
  ngOnDestroy() {
    if (this.monthlyChart) {
      this.monthlyChart.destroy();
    }
    if (this.categoryChart) {
      this.categoryChart.destroy();
    }
  }
}