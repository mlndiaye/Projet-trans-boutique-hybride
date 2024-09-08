import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { User, UserService } from '../../services/user.service';
import { AuthService } from '../../../authentication/services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { CommonModule } from '@angular/common';
import { passwordMatchValidator } from '../../../authentication/inscription/components/inscription/inscription.component';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})


export class UserProfileComponent implements OnInit{
  profileForm: FormGroup;
  passwordForm: FormGroup;
  userService = inject(UserService);
  authService = inject(AuthService);
  user: User | undefined;
  notificationService = inject(NotificationService);
  profileSubmitted = false;
  passwordSubmitted = false;
  
  constructor(private formBuilder: FormBuilder) {
    this.profileForm = this.formBuilder.group({
      first_name : ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      address: ['', [Validators.required]]},
    );

    this.passwordForm = this.formBuilder.group({
      current_password: ['', [Validators.required, Validators.minLength(8)]],
      new_password: ['', [Validators.required, Validators.minLength(8)]],
      confirm_new_password: ['', [Validators.required, Validators.minLength(8)]]},
      {validator: passwordMatchValidator('new_password', 'confirm_new_password')}
    );
  }

  ngOnInit(): void {
    this.userService.getUserProfile().subscribe({
      next: (user) => { this.user = user; },
      error: (error) => { console.error('Error fetching user profile:', error); },
      complete: () => { console.log('User profile fetching completed'); } 
    })
  }

  changeProfil(){
    this.profileSubmitted = true;
    if (this.profileForm.valid) {
      this.userService.updateProfile(this.profileForm.value).subscribe({
        next: (response) => {
          console.log("Success");
          this.user = response;  // Récuperation des dernières modifications du user pour maj les placeholders
          this.profileForm.patchValue({
            first_name: this.user?.first_name,
            last_name: this.user?.last_name,
            email: this.user?.email,
            address: this.user?.address
          });
          this.notificationService.showSuccess('Profile updated successfully');
          this.profileForm.reset();  // Réinitialiser les champs du formulaire
          this.profileSubmitted = false;
        },
        error: (error) => {
          console.error("Error");
          this.notificationService.showError(error.error.error || 'An error occurred');
        }
      });
    }
  }
  

  changePassword(){
    this.passwordSubmitted = true;
    if (this.passwordForm.valid) {
      const { current_password, new_password, confirm_new_password } = this.passwordForm.value;
      this.authService.changePassword({current_password, new_password}).subscribe({
        next: (response) => {
          this.notificationService.showSuccess('Password updated successfully');
          this.passwordForm.reset();  // Réinitialiser les champs du formulaire
          this.passwordSubmitted = false;
        },
        error: (error) => {
          this.notificationService.showError(error.error.error || 'An error occurred');
        },
      });
    }
  }

}



