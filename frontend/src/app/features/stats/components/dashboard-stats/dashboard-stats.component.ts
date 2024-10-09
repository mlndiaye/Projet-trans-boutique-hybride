import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { DashboardStats, DashboardStatsService, LowStockProduct } from '../../services/dashboard-stats.service';
import { CommonModule } from '@angular/common';
import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { AuthService } from '../../../authentication/services/auth.service';
import { Router } from '@angular/router';


// Enregistrer tous les éléments nécessaires de Chart.js
Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard-stats.component.html',
  styleUrls: ['./dashboard-stats.component.scss'],
  standalone: true,
  imports: [CommonModule]
})

export class DashboardStatsComponent implements OnInit {
  stats: DashboardStats | null = null;
  monthlyChart: Chart | undefined;
  categoryChart: Chart | undefined;
  lowStockProducts: LowStockProduct[] = [];
  isLowStockModalOpen = false;

  constructor(private dashboardService: DashboardStatsService,
    private dialog: Dialog,
    private authServive: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
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
        // Afficher un message d'erreur à l'utilisateur, si nécessaire
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