import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AuthService } from '../../../authentication/services/auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-product-cart',
  standalone: true,
  imports: [CommonModule, RouterLink, CommonModule],
  templateUrl: './product-cart.component.html',
  styleUrl: './product-cart.component.css'
})
export class ProductCartComponent {
  authService = inject(AuthService);
  constructor() { }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
}
