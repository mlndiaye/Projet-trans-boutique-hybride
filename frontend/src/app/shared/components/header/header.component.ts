import { Component, inject, OnInit } from '@angular/core';
import { UserService } from '../../../features/profile/services/user.service';
import { AuthService } from '../../../features/authentication/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from '../../../features/products/services/cart.service';
import { WishlistService } from '../../../features/products/services/wishlist.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})

export class HeaderComponent implements OnInit{
  userName: string | null = null;
  userService = inject(UserService);
  authService = inject(AuthService);
  router = inject(Router);
  cartItemsCount: number = 0;
  cartService = inject(CartService);
  wishlistCount: number = 0;
  wishlistService = inject(WishlistService);
  searchTerm: string = '';

  constructor() {
    this.cartService.cart$.subscribe(cart => {
      this.cartItemsCount = cart.items.length;
    });
    this.wishlistService.wishlist$.subscribe(
      wishlist => {
        this.wishlistCount = wishlist.length;
      }
    );
   }

  ngOnInit(): void {
    this.authService.authStatus$.subscribe(isLoggedIn => {
      if (isLoggedIn) {
        this.userService.getUserProfile().subscribe({
          next: (user) => { this.userName = user.first_name; },
          error: (error) => { console.error('Error fetching user profile:', error); },
          complete: () => { console.log('User profile fetching completed'); }
        });
      }
    });
    
  }


  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  getWishlistCount(): void {
    this.wishlistService.getWishlist().subscribe(
      (wishlist) => {
        this.wishlistCount = wishlist.length;
      },
      (error) => {
        console.error('Error fetching wishlist count:', error);
      }
    );
  }

  onSearch() {
    if (this.searchTerm) {
      this.router.navigate(['/products/search'], {
        queryParams: { name_product: this.searchTerm }
      });
    }
  }
}