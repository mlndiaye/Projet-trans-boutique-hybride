import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product, ProductService } from './product.service';


export interface CartItem {
  id: number,
  name: string,
  price: number,
  quantity: number,
  image: string
}

export interface ShoppingCart {
  items: CartItem[];
  totalAmount: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private STORAGE_KEY = 'shopping_cart';
  private cartSubject = new BehaviorSubject<ShoppingCart>(this.loadCart());
  cart$ = this.cartSubject.asObservable();

  constructor(private productService: ProductService) {}

  calculateTotalAmount(items: CartItem[]): number {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  getItemSubtotal(item: CartItem): number {
    return item.price * item.quantity;
  }

  private saveCart(cart: ShoppingCart): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cart));
    } else {
      // Handle the server-side scenario or provide a fallback
    }
  }
  
  private loadCart(): ShoppingCart {
    if (typeof localStorage !== 'undefined') {
      const storedCart = localStorage.getItem(this.STORAGE_KEY);
      return storedCart ? JSON.parse(storedCart) : { items: [], totalAmount: 0 };
    } else {
      // Handle the server-side scenario or provide a fallback
      return { items: [], totalAmount: 0 };
    }
  }
  
  private updateCartSubject(cart: ShoppingCart): void {
    this.cartSubject.next(cart);
    this.saveCart(cart);
  }

  addItem(product: Product, quantity: number = 1) {
    const currentCart = this.cartSubject.value;
    const existingItem = currentCart.items.find((i) => i.id === product.id_product);

    if (existingItem) {
      // Increment quantity if item already exists
      existingItem.quantity += quantity;
    } else {
      // Add the new item if it doesn't exist
      const newItem: CartItem = {
        id: product.id_product,
        name: product.name_product,
        price: parseFloat(product.price_product),
        quantity: quantity,
        image: product.images.length > 0 ? product.images[0].src_img : ''
      };
      currentCart.items.push(newItem);
    }

    currentCart.totalAmount = this.calculateTotalAmount(currentCart.items);
    this.updateCartSubject(currentCart);
  }

  removeItem(product_id: number) {
    const currentCart = this.cartSubject.value;
    const item = currentCart.items.find((i) => i.id === product_id);

    if (item) {
      currentCart.totalAmount -= item.price * item.quantity;
      currentCart.items = currentCart.items.filter((i) => i.id !== product_id);
      this.updateCartSubject(currentCart);
    }
  }

  updateCartItem(updatedItem: CartItem) {
    const currentCart = this.cartSubject.value;
    const itemIndex = currentCart.items.findIndex((i) => i.id === updatedItem.id);
    if (itemIndex > -1) {
      currentCart.items[itemIndex] = updatedItem;
      currentCart.totalAmount = this.calculateTotalAmount(currentCart.items);
      this.updateCartSubject(currentCart);
    }
  }

  clearCart() {
    const emptyCart: ShoppingCart = { items: [], totalAmount: 0 };
    this.updateCartSubject(emptyCart);
  }
}
