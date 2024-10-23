import { Component, inject, OnInit } from '@angular/core';
import { Product, ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { WishlistService } from '../../services/wishlist.service';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.css'
})
export class WishlistComponent implements OnInit {
  wishlist_products: Product[] = [];
  productService =  inject(ProductService);
  cartService = inject(CartService);
  wishlistService = inject(WishlistService);

  ngOnInit(): void {
    this.wishlistService.getWishlist().subscribe((wishlist) =>{
      this.wishlist_products = wishlist;
    })
  }

  addToCart(product: Product, quantity: number = 1): void {
    this.cartService.addItem(product, quantity);
  }

  removeFromWishlist(productId: number): void{
    this.wishlistService.removeFromWishlist(productId);
  }

  clearWishlist(): void {
    this.wishlistService.clearWishlist();
  }


}
