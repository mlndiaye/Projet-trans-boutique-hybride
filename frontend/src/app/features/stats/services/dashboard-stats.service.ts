import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DashboardStats } from '../interfaces/dashboartStats';
import { LowStockProduct } from '../interfaces/lowstock';
import { SaleDetails } from '../interfaces/sales';



@Injectable({
  providedIn: 'root'
})
export class DashboardStatsService {
  private apiUrl = 'http://localhost:8000/api/products/dashboard';

  constructor(private http: HttpClient) {}

  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.apiUrl}/stats`);
  }

  getSalesDetails(): Observable<SaleDetails[]> {
    return this.http.get<SaleDetails[]>(`${this.apiUrl}/sales`);
  }

  getLowStockProducts(): Observable<LowStockProduct[]> {
    return this.http.get<LowStockProduct[]>(`${this.apiUrl}/low-stock-products`);
  }
}