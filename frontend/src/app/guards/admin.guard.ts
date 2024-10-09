// src/app/guards/admin.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from '../features/authentication/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> {
    return this.authService.authStatus$.pipe(
      tap(isLoggedIn => {
        if (!isLoggedIn) {
          // Rediriger vers la page de connexion si non connecté
          this.router.navigate(['/login']);
          return false;
        }

        // Vérifier si l'utilisateur est admin
        const authUser = localStorage.getItem('authUser');
        if (authUser) {
          const user = JSON.parse(authUser);
          if (!user.user?.is_staff) {
            // Rediriger vers la page d'accueil si non admin
            this.router.navigate(['/']);
            return false;
          }
          return true;
        }
        return false;
      })
    );
  }
}