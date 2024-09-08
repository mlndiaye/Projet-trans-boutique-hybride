import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, of, switchMap, throwError } from 'rxjs';
import { AuthService } from '../../authentication/services/auth.service';

export interface User{
  id: number,
  email: string,
  first_name: string,
  last_name: string,
  address: string
}

@Injectable({
  providedIn: 'root'
})

export class UserService {
  httpClient = inject(HttpClient);
  baseUrl = 'http://localhost:8000/auth';
  authService = inject(AuthService);

  constructor() { }

  getUserProfile(): Observable<any> {
    return this.httpClient.get<any>(`${this.baseUrl}/profile`)
  }
 
   /*  getUserProfile(): Observable<any> {
      return this.makeRequestWithToken();
    }
  
    private makeRequestWithToken(): Observable<any> {
      const headers = this.authService.getAuthHeaders();
  
      return this.httpClient.get<any>(`${this.baseUrl}/profile`, { headers }).pipe(
        catchError(error => {
          if (error.status === 401) {
            // Token is likely expired, try to refresh
            return this.authService.refreshToken().pipe(
              switchMap(newToken => {
                if (newToken) {
                  // Retry the original request with the new token
                  const newHeaders = headers.set('Authorization', `Bearer ${newToken}`);
                  return this.httpClient.get<any>(`${this.baseUrl}/profile`, { headers: newHeaders });
                } else {
                  // Handle the case where refresh fails
                  return of(null); // or handle logout
                }
              }),
              catchError(err => {
                console.error('Error retrying request', err);
                return of(null); // or handle logout
              })
            );
          }
          return throwError(() => error);
        })
      );
    }
 */
    updateProfile(data: any): Observable<any> {
      return this.httpClient.put(`${this.baseUrl}/update-profile/`, data);
    }
}
