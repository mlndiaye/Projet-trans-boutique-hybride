import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-inscription',
  standalone: true,
  imports: [],
  templateUrl: './inscription.component.html',
  styleUrl: './inscription.component.css'
})
export class InscriptionComponent {
  inscriptionForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.inscriptionForm = this.formBuilder.group({
      nom : ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', Validators.email],
      mot_de_passe: ['', Validators.required, Validators.minLength(8)],
      confirmation_mot_de_passe: ['', Validators.required]
    });
    
  }

}
