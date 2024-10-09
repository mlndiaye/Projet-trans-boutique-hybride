import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LowStockProduct {
  id_product: number;
  name_product: string;
  stock: number;
  minimum_stock: number;
  category: Category;
}

interface Category {
  id_category: number;
  name_category: string;
  description: string;
}

export interface DashboardStats {
  global_stats: {
    total_products: number;
    total_sales: number;
    low_stock_products: number;
  };
  sales_by_category: Array<{
    name_category: string;
    total_sales: number;
  }>;
  monthly_sales: Array<{
    month: string;
    sales: number;
  }>;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardStatsService {
  private apiUrl = 'http://localhost:8000/api/dashboard';

  constructor(private http: HttpClient) {}

  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.apiUrl}/stats`);
  }

  getLowStockProducts(): Observable<LowStockProduct[]> {
    return this.http.get<LowStockProduct[]>(`${this.apiUrl}/low-stock-products`);
  }
}