import { Component } from '@angular/core';
import { Product, ProductFilter, ProductService } from '../../services/product.service';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule, NgModel } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-search-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search-products.component.html',
  styleUrl: './search-products.component.css'
})
export class SearchProductsComponent {
  products: Product[] = [];
  filters: ProductFilter = {};
  sortBy: string = 'price_product';
  searchTerm: string = '';

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    // S'abonner aux changements des query parameters
    this.route.queryParams.subscribe(params => {
      if (params['name_product']) {
        this.searchTerm = params['name_product'];
        this.filters.name_product = this.searchTerm;
        this.searchProducts();
      } else {
        // Si pas de terme de recherche, rediriger vers la page principale des produits
        this.router.navigate(['/products']);
      }
    });
  }

  searchProducts() {
    this.productService.getProducts(this.filters).subscribe(
      (data) => {
        this.products = data;
      },
      (error) => {
        console.error('Erreur lors de la recherche des produits:', error);
      }
    );
  }

  applyFilters() {
    // Mettre à jour les query parameters avec tous les filtres
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        name_product: this.searchTerm,
        category: this.filters.category,
        sort: this.sortBy
      }
    });
    
    this.searchProducts();
  }
}