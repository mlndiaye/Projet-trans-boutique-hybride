import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  httpClient = inject(HttpClient);
  baseUrl = 'http://localhost:8000/auth';

  private authStatusSubject = new BehaviorSubject<boolean>(this.isLoggedIn());
  authStatus$: Observable<boolean> = this.authStatusSubject.asObservable();
  
  constructor() { }


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
    const headers = this.getAuthHeaders();
    return this.httpClient.post<any>(`${this.baseUrl}/change-password/`, passwordData, { headers });
  }

  getAuthHeaders(): HttpHeaders {
    const token = this.getAccessToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  logout() {
    localStorage.removeItem('authUser');
    this.authStatusSubject.next(false);
  }

  isLoggedIn() {
    return localStorage.getItem('authUser') !== null;
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
