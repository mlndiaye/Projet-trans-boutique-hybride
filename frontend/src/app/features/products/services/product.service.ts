// produit.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = 'http://localhost:8000/api/';

  constructor(private http: HttpClient) {}

  addProduct(produit: any, images: File[]): Observable<any> {
    const formData = new FormData();
    Object.keys(produit).forEach((key) => formData.append(key, produit[key]));
    images.forEach((image) => formData.append('images', image, image.name));
    return this.http.post(`${this.apiUrl}produits/`, formData);
  }

  getCategories(): Observable<any> {
    return this.http.get(`${this.apiUrl}categories/`);
  }

  getProducts(){}
  getProductById(){}
}
