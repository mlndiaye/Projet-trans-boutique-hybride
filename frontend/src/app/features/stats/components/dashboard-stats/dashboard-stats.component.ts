import { Component, OnInit } from '@angular/core';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { CommonModule } from '@angular/common';
import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { AuthService } from '../../../authentication/services/auth.service';
import { Router } from '@angular/router';
import { DashboardStatsService } from '../../services/dashboard-stats.service';
import { CategorySale, DailySale, DashboardStats, LowStockProduct, MonthlySale, MostViewedProduct, SaleDetails, WeeklySale } from '../../interfaces/sales';
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
  categoryChartType: 'bar' | 'pie' = 'bar';
  viewsChart: Chart | undefined; 

  lowStockProducts: LowStockProduct[] = [];
  salesDetails: SaleDetails[] = [];
  totalSales: number = 0;
  currentPeriod: 'day' | 'week' | 'month' = 'month';


  isLowStockModalOpen = false;
  isSalesModalOpen = false;

  filteredSales: any[] = [];  // Les ventes filtrées à afficher
  startDate: string = "";  // Date de début pour le filtre
  endDate: string = "";    // Date de fin pour le filtre



  constructor(
    private dashboardService: DashboardStatsService,
    private dialog: Dialog,
    private authServive: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.calculateTotalSales();
    this.loadDashboardData();
  }

  loadDashboardData(period: 'day' | 'week' | 'month' = 'month') {
    this.dashboardService.getDashboardStats(period).subscribe(
      (data: DashboardStats) => {
        console.log(`Données reçues pour la période ${period}:`, data);
        this.stats = data;
        this.initializeCharts();
      },
      error => {
        console.error('Erreur lors du chargement des données du tableau de bord:', error);
      }
    );
  }
  

  changeCategoryChartType(type: 'bar' | 'pie') {
    this.categoryChartType = type;  // Mettre à jour le type de graphique
    this.renderCategoryChart();     // Recréer le graphique avec le nouveau type
  }

  onPeriodChange(period: 'day' | 'week' | 'month') {
    this.currentPeriod = period;
    this.loadDashboardData(period);
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

  private renderPeriodlySalesChart(){
    if (this.monthlyChart) {
      this.monthlyChart.destroy();
    }
    if (this.viewsChart) {
      this.viewsChart.destroy();
    }
    const monthlyCtx = document.getElementById('monthlyChart') as HTMLCanvasElement;
    this.monthlyChart = new Chart(monthlyCtx, {
      type: 'line',
      data: {
        labels: this.getLabels(),
        datasets: [{
          label: this.getPeriodLabel(),
          data: this.getSalesData(),
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
  }
  

  private initializeCharts() {
      // Period Sales Chart
      this.renderPeriodlySalesChart();
      // Category Sales Chart
      this.renderCategoryChart();
      this.mostViewedProducts();  
  }

  private mostViewedProducts(){
    if (this.stats) {
    const viewsCtx = document.getElementById('viewsChart') as HTMLCanvasElement;
    this.viewsChart = new Chart(viewsCtx, {
      type: 'bar',
      data: {
        labels: this.stats.most_viewed_products.map((item: MostViewedProduct) => item.name_product),
        datasets: [{
          label: 'Produits les plus consultés',
          data: this.stats.most_viewed_products.map((item: MostViewedProduct) => item.views_count),
          backgroundColor: '#4CAF50',
          borderColor: '#388E3C',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Nombre de vues'
            }
          },
          x: {
            ticks: {
              maxRotation: 45,
              minRotation: 45
            }
          }
        },
        plugins: {
          legend: {
            display: true,
            position: 'top'
          },
          title: {
            display: true,
            text: 'Top 5 des produits les plus consultés'
          }
        }
      }
    });
    
  }
}

  private renderCategoryChart() {
    if (this.categoryChart) {
      this.categoryChart.destroy();
    }
  
    const categoryCtx = document.getElementById('categoryChart') as HTMLCanvasElement;
    if (!categoryCtx) return;
  
    const chartConfig: ChartConfiguration = {
      type: this.categoryChartType,
      data: {
        labels: this.stats?.sales_by_category.map((item: CategorySale) => item.name_category) || [],
        datasets: [{
          label: 'Ventes par Catégorie',
          data: this.stats?.sales_by_category.map((item: CategorySale) => item.total_sales) || [],
          backgroundColor: this.categoryChartType === 'pie' 
            ? ['#FF6384', '#36A2EB', '#FFCE56', '#82ca9d', '#FF9F40'] 
            : '#82ca9d'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { 
            display: true 
          }
        },
        ...(this.categoryChartType === 'pie' && {
          layout: {
            padding: {
              left: 20,
              right: 20,
              top: 0,
              bottom: 0
            }
          }
        })
      }
    };
  
    this.categoryChart = new Chart(categoryCtx, chartConfig);
  }


  private getLabels(): string[] {
    if (!this.stats) return [];
    
    let labels: string[] = [];
    switch(this.currentPeriod) {
      case 'day':
        labels = this.stats.daily_sales.map((item: DailySale) => 
          new Date(item.date).toLocaleDateString('fr-FR')
        );
        break;
      case 'week':
        labels = this.stats.weekly_sales.map((item: WeeklySale) => 
          `Semaine ${this.getWeekNumber(new Date(item.date))}`
        );
        break;
      case 'month':
      default:
        labels = this.stats.monthly_sales.map((item: MonthlySale) => {
          console.log('Item mensuel:', item);
          return item.month;
        });
        break;
    }
    console.log(`Labels pour ${this.currentPeriod}:`, labels);
    return labels;
  }


  private getSalesData(): number[] {
    if (!this.stats) return [];
    
    let salesData: number[] = [];
    switch(this.currentPeriod) {
      case 'day':
        salesData = this.stats.daily_sales.map((item: DailySale) => item.sales);
        break;
      case 'week':
        salesData = this.stats.weekly_sales.map((item: WeeklySale) => item.sales);
        break;
      case 'month':
      default:
        salesData = this.stats.monthly_sales.map((item: MonthlySale) => item.sales);
        break;
    }
    console.log(`Données de ventes pour ${this.currentPeriod}:`, salesData);
    return salesData;
  }

  private getPeriodLabel(): string {
    switch(this.currentPeriod) {
      case 'day':
        return 'Ventes Journalières';
      case 'week':
        return 'Ventes Hebdomadaires';
      case 'month':
        return 'Ventes Mensuelles';
    }
  }

  private getWeekNumber(date: Date): number {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
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
    if (this.viewsChart){
      this.viewsChart.destroy();
    }
  }
}

