import { Injectable } from '@angular/core';
import { ShoppingCart } from './cart.service';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class OrderService {

  private apiUrl = 'http://localhost:8000/api/create-order/'; // URL de l'API backend


  constructor(private http: HttpClient) { }

  createOrder(cart: ShoppingCart, token: string): Observable<any> {
    const orderData = {
      total_amount: cart.totalAmount,  // Montant total de la commande
      order_items: cart.items.map(item => ({
        product_id: item.id,    // ID du produit
        quantity: item.quantity // Quantité de chaque produit
      }))
    };

    // Envoyer une requête POST au backend pour créer la commande
    return this.http.post(this.apiUrl, orderData);
  }
}
