import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ChatService } from '../../../core/services/chat/chat.service';
import { tap } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule],
})
export class HomeComponent implements OnInit {
  featuredRooms: any[] = [];

  constructor(private readonly chatService: ChatService) {}

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
}
