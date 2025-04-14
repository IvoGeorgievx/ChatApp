import { Component, inject } from '@angular/core';
import { AuthService } from '../../../core/services/auth/auth.service';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  private readonly authService = inject(AuthService);

  logout(): void {
    this.authService.logout();
  }

  get isLoggedIn(): boolean {
    return !!this.authService.currentUser();
  }
}
