import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Category, Product, ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';
import { forkJoin, switchMap } from 'rxjs';

@Component({
  selector: 'app-products-by-category',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './products-by-category.component.html',
  styleUrl: './products-by-category.component.css'
})
export class ProductsByCategoryComponent {
  products: Product[] = [];
  productService = inject(ProductService);
  cartService = inject(CartService);
  wishlistService = inject(WishlistService);
  wishlistProducts: Set<Product> = new Set();
  categories: Category[] = [];
  category: Category|undefined;
  name_category!: string;
  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.params.pipe(
      switchMap(params => {
        this.name_category = params['category_name'];
        return forkJoin({
          products: this.productService.getProductsByCategory(this.name_category),
          categories: this.productService.getCategories()
        });
      })
    ).subscribe(({ products, categories }) => {
      this.products = products;
      this.categories = categories;
      this.category = this.categories.find(
        category => category.name_category.toLowerCase() === this.name_category.toLowerCase()
      );
    });
  
    this.loadWishlist();
  }
  getProductDetails(id: number): void {
    this.productService.getProductById(id).subscribe((product: Product) => {
      console.log(product);
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
    console.log(this.wishlistProducts);
    return this.wishlistProducts.has(product);
  }
}
