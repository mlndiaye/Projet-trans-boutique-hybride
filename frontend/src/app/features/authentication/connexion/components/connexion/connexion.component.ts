import { Component, inject } from '@angular/core';
import { AuthService } from '../../../auth.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-connexion',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './connexion.component.html',
  styleUrl: './connexion.component.css'
})
export class ConnexionComponent {
  authService = inject(AuthService);
  router = inject(Router);

  protected loginForm = new FormGroup({
    email: new FormControl('', [Validators  .required, Validators.email]),
    password: new FormControl('', [Validators.required])
  })

  onSubmit(){
    if(this.loginForm.valid){
      console.log(this.loginForm.value);
      this.authService.login(this.loginForm.value)
      .subscribe((data: any) => {
        if(this.authService.isLoggedIn()){
          this.router.navigate(['/']);
        }
        console.log(data);
      });
    }
  }
}
