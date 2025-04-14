import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ChatService } from '../../../core/services/chat/chat.service';
import { AuthService } from '../../../core/services/auth/auth.service';
import { tap } from 'rxjs';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent],
})
export class HomeComponent implements OnInit {
  featuredRooms: any[] = [];

  private readonly chatService = inject(ChatService);
  private readonly authService = inject(AuthService);

  ngOnInit(): void {
    this.loadFeaturedRooms();
  }

  loadFeaturedRooms(): void {
    this.chatService
      .getCurrentRooms()
      .subscribe((data) => (this.featuredRooms = data.slice(0, 3)));
  }

  scrollToRooms(): void {
    const roomsElement = document.getElementById('rooms-preview');
    if (roomsElement) {
      roomsElement.scrollIntoView({ behavior: 'smooth' });
    }
  }

  get isLoggedIn(): boolean {
    return !!this.authService.currentUser();
  }

  logout(): void {
    this.authService.logout();
  }
}
