import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})

export class NotificationService {

  constructor(private snackBar: MatSnackBar) { }

  showSuccess(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 2000,
      verticalPosition: 'top',  // Afficher en haut
      horizontalPosition: 'center',  // Centrer horizontalement
      panelClass: ['snack-success']
    });
  }

  showError(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 2000,
      verticalPosition: 'top',  // Afficher en haut
      horizontalPosition: 'center',  // Centrer horizontalement
      panelClass: ['snack-error']
    });
  }
}
