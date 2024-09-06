import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  httpClient = inject(HttpClient);
  baseUrl = 'http://localhost:8000/auth';

  constructor() { }

  signup(data: any) {
    return this.httpClient.post(`${this.baseUrl}/inscription/`, data);
  }

  login(data: any) {
    return this.httpClient.post(`${this.baseUrl}/login/`, data)
      .pipe(tap((result) => {
        localStorage.setItem('authUser', JSON.stringify(result));
      }));
  }

  logout() {
    localStorage.removeItem('authUser');
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

  refreshToken() {
    const refreshToken = this.getRefreshToken();
    return this.httpClient.post(`${this.baseUrl}/token/refresh/`, { refresh: refreshToken })
      .pipe(tap((result: any) => {
        // Update authUser with new access token
        const authUser = JSON.parse(localStorage.getItem('authUser') || '{}');
        authUser.access = result.access;
        localStorage.setItem('authUser', JSON.stringify(authUser));
      }));
  }
  
}
