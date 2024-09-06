import { Component, inject } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-connexion',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './connexion.component.html',
  styleUrl: './connexion.component.css'
})
export class ConnexionComponent {
  authService = inject(AuthService);
  router = inject(Router);
  serverError: string | null = null;


  protected loginForm = new FormGroup({
    email: new FormControl('', [Validators  .required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)])
  })

  onSubmit() {
    if (this.loginForm.valid) {
      this.serverError = null;
      this.authService.login(this.loginForm.value)
        .pipe(
          catchError((error) => {
            this.serverError = error.error.message || 'Mot de passe ou email incorrects';
            return of(null);
          })
        )
        .subscribe((data: any) => {
          if (data && this.authService.isLoggedIn()) {
            this.router.navigate(['/']);
          }
        });
    }
  }
}
