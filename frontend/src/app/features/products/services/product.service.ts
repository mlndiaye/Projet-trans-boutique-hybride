// produit.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Category {
  id_category: number;
  name_category: string;
  img_category: string;
  description: string;
}

export interface Image {
  id_img: number;
  src_img: string;
}

export interface Product {
  id_product: number;
  name_product: string;
  description: string;
  price_product: string;
  stock: number;
  created_at: string;
  updated_at: string;
  qr_code: string;
  category: Category;
  images: Image[];
}

export interface ProductFilter {
  name_product?: string;
  category?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = 'http://127.0.0.1:8000/api/';

  constructor(private http: HttpClient) {}

  addProduct(produit: any, images: File[]): Observable<any> {
    const formData = new FormData();
    Object.keys(produit).forEach((key) => formData.append(key, produit[key]));
    images.forEach((image) => formData.append('images', image, image.name));
    return this.http.post(`${this.apiUrl}produits/`, formData);
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}categories/`);
  }

  // Get all products
  getProducts(filter?: ProductFilter): Observable<Product[]> {
    let params = new HttpParams();
    if (filter) {
      if (filter.name_product) {
        params = params.set('name_product', filter.name_product);
      }
      if (filter.category) {
        params = params.set('category', filter.category);
      }
    }
    return this.http.get<Product[]>(`${this.apiUrl}products/`, { params });
  }

  // Get a product by its ID
  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}products/${id}/`);
  }

  getProductsByCategory(name_category: string): Observable<Product[]>{
    return this.http.get<Product[]>(`${this.apiUrl}products/category/${name_category}`);
  }
}
