// wishlist.service.ts
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Product } from './product.service';
import { AuthService } from '../../authentication/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private apiUrl = 'http://127.0.0.1:8000/products/';
  private wishlistSubject = new BehaviorSubject<Product[]>([]);
  public wishlist$ = this.wishlistSubject.asObservable();
  private authService = inject(AuthService)
  constructor(
    private http: HttpClient,
  ) {
    // S'abonner aux changements d'état de connexion
    this.authService.authStatus$.subscribe(isLoggedIn => {
      if (isLoggedIn) {
        this.loadWishlist();
      } else {
        // Réinitialiser le wishlist quand l'utilisateur se déconnecte
        this.wishlistSubject.next([]);
      }
    });
  }

  /* private loadWishlist() {
    if (this.authService.isLoggedIn()) {
      this.http.get<Product[]>(`${this.apiUrl}get-wishlist/`).subscribe(
        wishlist => this.wishlistSubject.next(wishlist),
        error => console.error('Error loading wishlist:', error)
      );
    } else {
      this.wishlistSubject.next([]);
    }
  } */
    loadWishlist() {
      if (this.authService.isLoggedIn()) {
        this.http.get<Product[]>(`${this.apiUrl}get-wishlist/`).subscribe(
          wishlist => {
            wishlist.forEach(item => {
              if (item.images && item.images.length > 0) {
                item.images.forEach(image => {
                  // Update the 'src_img' field with the full URL
                  image.src_img = `http://127.0.0.1:8000${image.src_img}`;
                });
              }
            });
            this.wishlistSubject.next(wishlist);
          },
          error => console.error('Error loading wishlist:', error)
        );
      }else {
        this.wishlistSubject.next([]);
      }
    }


  getWishlist(): Observable<Product[]> {
    return this.wishlist$;
  }

  toggleWishlist(product: Product): Observable<any> {
    return this.http.post(`${this.apiUrl}toggle-wishlist/`, { product_id: product.id_product }).pipe(
      tap(() => {
        const currentWishlist = this.wishlistSubject.value;
        const productExists = currentWishlist.some(item => item.id_product === product.id_product);
        
        if (productExists) {
          console.log("Already in wishlist");
        } else {
          currentWishlist.push(product);
        }
        
        this.wishlistSubject.next(currentWishlist);
      })
    );
  }

  removeFromWishlist(productId: number): void {
    this.http.delete(`${this.apiUrl}remove-from-wishlist/${productId}/`).pipe(
      tap(() => {
        const currentWishlist = this.wishlistSubject.value.filter(p => p.id_product !== productId);
        this.wishlistSubject.next(currentWishlist);
      })
    ).subscribe();
  }

  clearWishlist(): void {
    this.http.delete(`${this.apiUrl}clear-wishlist/`).pipe(
      tap(() => this.wishlistSubject.next([]))
    ).subscribe();
  }
}