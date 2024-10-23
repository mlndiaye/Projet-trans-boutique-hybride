import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../authentication/services/auth.service';
import { CartItem, CartService, ShoppingCart } from '../../services/cart.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-cart',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './product-cart.component.html',
  styleUrls: ['./product-cart.component.css']
})
export class ProductCartComponent implements OnInit {
  authService = inject(AuthService);
  cartService = inject(CartService);
  cart: ShoppingCart = { items: [], totalAmount: 0 };

  constructor() {}

  ngOnInit() {
    this.cartService.cart$.subscribe((cart) => {
      this.cart = cart;
    });
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  removeItem(productId: number) {
    this.cartService.removeItem(productId);
  }

  updateQuantity(itemId: number, quantity: number) {
    const item = this.cart.items.find(item => item.id === itemId);
    if (item) {
      item.quantity = quantity;
      this.cartService.updateCartItem(item);
    }
  }

  getSubtotal(item: CartItem): number {
    return this.cartService.getItemSubtotal(item);
  }

  getTotalPrice() {
    return this.cartService.calculateTotalAmount(this.cart.items);
  }

  getTaxes(){
    return this.getTotalPrice()*0.1;
  }

}