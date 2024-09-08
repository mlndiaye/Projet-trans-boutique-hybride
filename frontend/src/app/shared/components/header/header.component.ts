import { Component, inject, OnInit } from '@angular/core';
import { UserService } from '../../../features/profile/services/user.service';
import { AuthService } from '../../../features/authentication/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit{
  userName: string | null = null;
  userService = inject(UserService);
  authService = inject(AuthService);
  router = inject(Router);
  constructor() { }

  ngOnInit(): void {
    this.authService.authStatus$.subscribe(isLoggedIn => {
      if (isLoggedIn) {
        this.userService.getUserProfile().subscribe({
          next: (user) => { this.userName = user.first_name; },
          error: (error) => { console.error('Error fetching user profile:', error); },
          complete: () => { console.log('User profile fetching completed'); }
        });
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
}