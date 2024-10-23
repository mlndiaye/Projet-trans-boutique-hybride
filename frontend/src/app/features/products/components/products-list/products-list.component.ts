import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { Category, Product, ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { RouterLink } from '@angular/router';
import { WishlistService } from '../../services/wishlist.service';

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.css'
})
export class ProductsListComponent implements OnInit {
  products: Product[] = [];
  productService = inject(ProductService);
  cartService = inject(CartService);
  wishlistService = inject(WishlistService);
  wishlistProducts: Set<Product> = new Set();
  categories: Category[] = [];

  constructor() {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe((data: Product[]) => {
      this.products = data;
    });
    this.productService.getCategories().subscribe((categories: Category[]) => {
      this.categories = categories;
    })
    this.loadWishlist();
  }
  getProductDetails(id: number): void {
    this.productService.getProductById(id).subscribe((product: Product) => {
    });
  }
  addToCart(product: Product, quantity: number = 1): void {
    this.cartService.addItem(product, quantity);
  }

  loadWishlist() {
    this.wishlistService.getWishlist().subscribe(
      (wishlist: Product[]) => {
        this.wishlistProducts = new Set(wishlist);
      }
    );
  }

  toggleWishlist(product: Product) {
    this.wishlistService.toggleWishlist(product).subscribe();
  }

  isInWishlist(product: Product): boolean {
    return this.wishlistProducts.has(product);
  }
}
