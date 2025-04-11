import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule],
})
export class HomeComponent implements OnInit {
  // Sample data for featured rooms - this would typically come from your backend
  featuredRooms: any[] = [];

  constructor() {}

  ngOnInit(): void {
    // Simulate fetching featured rooms from backend
    this.loadFeaturedRooms();
  }

  loadFeaturedRooms(): void {
    // This would be replaced with a real API call in production
    this.featuredRooms = [
      {
        name: 'General Chat',
        members: 32,
        description: 'A place to discuss anything and everything',
      },
      {
        name: 'Tech Talk',
        members: 18,
        description: 'Discuss the latest in technology and programming',
      },
      {
        name: 'Gaming',
        members: 24,
        description:
          'Connect with other gamers and discuss your favorite games',
      },
    ];
  }

  scrollToRooms(): void {
    const roomsElement = document.getElementById('rooms-preview');
    if (roomsElement) {
      roomsElement.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
