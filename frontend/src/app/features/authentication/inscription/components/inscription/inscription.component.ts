import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// Validateur personnalisé pour vérifier si les mots de passe correspondent
export function passwordMatchValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password');
    const confirmPassword = control.get('confirm_password');

    return password && confirmPassword && password.value !== confirmPassword.value
      ? { passwordMismatch: true }
      : null;
  };
}
 
@Component({
  selector: 'app-inscription',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './inscription.component.html',
  styleUrl: './inscription.component.css'
})
export class InscriptionComponent {
  inscriptionForm: FormGroup;
  authService = inject(AuthService);
  router = inject(Router);

  constructor(private formBuilder: FormBuilder) {
    this.inscriptionForm = this.formBuilder.group({
      first_name : ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirm_password: ['', [Validators.required, Validators.minLength(8)]]},
      {validator: passwordMatchValidator()}
    );
  }

  public onSubmit() {
    if (this.inscriptionForm.valid) {
      console.log(this.inscriptionForm.value);
      this.authService.signup(this.inscriptionForm.value)
        .subscribe({
          next: (data: any) => {
            console.log(data);
            this.router.navigate(['/connexion']);
          },
          error: (err) => console.log("err")
        });
    }
    else {
      this.inscriptionForm.markAllAsTouched(); 
    }
  }

}
