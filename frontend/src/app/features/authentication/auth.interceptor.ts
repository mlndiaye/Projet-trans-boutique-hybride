import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from './services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Ajoute le token d'accès si disponible
    const authToken = this.authService.getAccessToken();
    let authReq = req;

    if (authToken) {
      authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${authToken}`
        }
      });
    }
    console.log("intercept");
    // Gestion de la réponse
    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Si le token est expiré, essaie de rafraîchir le token
          return this.authService.refreshToken().pipe(
            switchMap(newToken => {
              if (newToken) {
                // Refaire la requête avec le nouveau token
                const newAuthReq = req.clone({
                  setHeaders: {
                    Authorization: `Bearer ${newToken}`
                  }
                });
                return next.handle(newAuthReq);
              } else {
                // Si le refresh échoue, déconnecte l'utilisateur ou gère autrement
                this.authService.logout();
                return throwError(() => error);
              }
            })
          );
        } else {
          return throwError(() => error);
        }
      })
    );
  }
}
