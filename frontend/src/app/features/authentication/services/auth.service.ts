import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { jwtDecode } from "jwt-decode"

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  httpClient = inject(HttpClient);
  baseUrl = 'http://localhost:8000/auth';

  private authStatusSubject = new BehaviorSubject<boolean>(this.isLoggedIn());
  authStatus$: Observable<boolean> = this.authStatusSubject.asObservable();
  
  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) { 
    
  }


  public checkAdminTokenFromUrl() {
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      if (token) {
        try {
          const decodedToken: any = jwtDecode(token);
          
          // Vérifier si le token est valide et provient d'un admin
          if (decodedToken.exp * 1000 > Date.now() && decodedToken.is_staff) {
            // Créer un objet authUser compatible avec votre structure existante
            const authUser = {
              access: token,
              refresh: token,
              user: {
                id: decodedToken.user_id,
                email: decodedToken.email,
                is_staff: decodedToken.is_staff
              }
            };

            // Stocker dans le localStorage comme pour un login normal
            localStorage.setItem('authUser', JSON.stringify(authUser));
            this.authStatusSubject.next(true);

            // Nettoyer l'URL
            this.router.navigate([], {
              relativeTo: this.route,
              queryParams: {},
              replaceUrl: true
            });
          }
        } catch (error) {
          console.error('Token admin invalide', error);
          this.router.navigate(['/unauthorized']);
        }
      }
    });
  }

  signup(data: any) {
    return this.httpClient.post(`${this.baseUrl}/inscription/`, data);
  }

  login(data: any) {
    return this.httpClient.post(`${this.baseUrl}/login/`, data)
      .pipe(tap((result) => {
        localStorage.setItem('authUser', JSON.stringify(result));
        this.authStatusSubject.next(true);
      }));
  }

  changePassword(passwordData: { current_password: string, new_password: string }): Observable<any> {
    return this.httpClient.post<any>(`${this.baseUrl}/change-password/`, passwordData);
  }


  logout() {
    localStorage.removeItem('authUser');
    this.authStatusSubject.next(false);
  }

  isLoggedIn() {
    return localStorage.getItem('authUser') !== null;
  }

  isAdmin(): boolean {
    const authUser = this.getCurrentUser();
    return authUser?.user?.is_staff === true;
  }

  getCurrentUser() {
    const authUser = localStorage.getItem('authUser');
    return authUser ? JSON.parse(authUser) : null;
  }

  getAccessToken() {
    const authUser = localStorage.getItem('authUser');
    if (authUser) {
      const parsed = JSON.parse(authUser);
      return parsed.access;
    }
    return null;
  }

  getRefreshToken() {
    const authUser = localStorage.getItem('authUser');
    if (authUser) {
      const parsed = JSON.parse(authUser);
      return parsed.refresh;
    }
    return null;
  }

  refreshToken(): Observable<string | null> {
    const refreshToken = this.getRefreshToken();
    if (refreshToken) {
      return this.httpClient.post<any>(`${this.baseUrl}/token/refresh/`, { refresh: refreshToken })
        .pipe(
          tap((result: any) => {
            // Update authUser with new access token
            const authUser = JSON.parse(localStorage.getItem('authUser') || '{}');
            authUser.access = result.access;
            localStorage.setItem('authUser', JSON.stringify(authUser));
          }),
          switchMap(result => of(result.access)), // Return the new access token
          catchError(error => {
            console.error('Error refreshing token', error);
            return of(null); // Handle refresh token errors
          })
        );
    }
    return of(null);
  }



      /* refreshToken() {
    const refreshToken = this.getRefreshToken();
    return this.httpClient.post(`${this.baseUrl}/token/refresh/`, { refresh: refreshToken })
      .pipe(tap((result: any) => {
        // Update authUser with new access token
        const authUser = JSON.parse(localStorage.getItem('authUser') || '{}');
        authUser.access = result.access;
        localStorage.setItem('authUser', JSON.stringify(authUser));
      }));
  } */
  
}
