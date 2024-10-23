import { Component, inject, OnInit } from '@angular/core';
import { Category, Product, ProductService } from '../../services/product.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent implements OnInit {
  p!: Product;
  products: Product[] = [];
  id: number = 0;
  quantity: { [id: number]: number } = {};
  productService =  inject(ProductService);
  cartService = inject(CartService);
  wishlistService = inject(WishlistService);
  wishlistProducts: Set<Product> = new Set();

  constructor(private route: ActivatedRoute){ }

  ngOnInit(): void{
    this.route.params.subscribe(params => {
      this.id = params['id'];
      this.productService.getProductById(this.id).subscribe((product) => {
        this.p = product;
      });
      this.productService.getProducts().subscribe((data: Product[]) => {
        this.products = data;
      });
    });
  } 
  
  getQty(id: number): number {
    return this.quantity[id] || 1;
  }

  incrementQty(id: number): void {
    if (this.quantity[id]) {
      this.quantity[id]++;
    } else {
      this.quantity[id] = 2;
    }
  } 

  decrementQty(id: number): void {
    if (this.quantity[id] && this.quantity[id] > 1) {
      this.quantity[id]--;
    }
  }

  addItem(p: Product, quantity: number){
    this.cartService.addItem(p, quantity);
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
    this.wishlistService.toggleWishlist(product).subscribe(
      (response: any) => {
        if (response.status === 'added') {
          this.wishlistProducts.add(product);
        } else {
          console.log('already in wishlist');
        }
      }
    );
  }

  isInWishlist(product: Product): boolean {
    return this.wishlistProducts.has(product);
  }
  
}
