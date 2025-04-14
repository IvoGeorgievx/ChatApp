import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ChatRoom } from '../../types/chat.type';
import { User } from '../../types/user.type';
import { HeaderComponent } from '../header/header.component';

interface Message {
  id: string;
  text: string;
  timestamp: Date;
  sender: User;
  roomId: string;
  read: boolean;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HeaderComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  // Chat rooms
  rooms: ChatRoom[] = [];
  filteredRooms: ChatRoom[] = [];
  selectedRoom: ChatRoom | null = null;
  roomSearchQuery: string = '';

  // User
  currentUser: User = { id: '1', username: 'CurrentUser' }; // This would come from your auth service

  // Messages
  messages: Message[] = [];
  newMessage: string = '';

  constructor() {}

  ngOnInit(): void {
    // This would normally come from your API
    this.loadMockData();
    this.filterRooms();
  }

  // Search functionality
  filterRooms(): void {
    if (!this.roomSearchQuery) {
      this.filteredRooms = [...this.rooms];
      return;
    }

    const query = this.roomSearchQuery.toLowerCase();
    this.filteredRooms = this.rooms.filter((room) =>
      room.name.toLowerCase().includes(query)
    );
  }

  // Room selection
  selectRoom(room: ChatRoom): void {
    this.selectedRoom = room;

    // Mark messages as read when selecting a room
    this.messages.forEach((msg) => {
      if (msg.roomId === room.id && msg.sender.id !== this.currentUser.id) {
        msg.read = true;
      }
    });
  }

  // Message methods
  getMessages(roomId: string): Message[] {
    return this.messages.filter((msg) => msg.roomId === roomId);
  }

  sendMessage(): void {
    if (!this.newMessage.trim() || !this.selectedRoom) return;

    const newMsg: Message = {
      id: Date.now().toString(), // Simple ID generation for demo
      text: this.newMessage,
      timestamp: new Date(),
      sender: this.currentUser,
      roomId: this.selectedRoom.id,
      read: true,
    };

    this.messages.push(newMsg);
    this.newMessage = '';

    // In a real app, you would send this to your backend
  }

  // Helper methods for UI
  getLastMessage(roomId: string): string {
    const roomMessages = this.messages
      .filter((msg) => msg.roomId === roomId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    if (roomMessages.length === 0) return 'No messages yet';

    const lastMsg = roomMessages[0];
    return lastMsg.text.length > 30
      ? lastMsg.text.substring(0, 27) + '...'
      : lastMsg.text;
  }

  getLastMessageTime(roomId: string): string {
    const roomMessages = this.messages
      .filter((msg) => msg.roomId === roomId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    if (roomMessages.length === 0) return '';

    const lastMsg = roomMessages[0];
    return this.formatMessageTime(lastMsg.timestamp);
  }

  getUnreadCount(roomId: string): number {
    return this.messages.filter(
      (msg) =>
        msg.roomId === roomId &&
        !msg.read &&
        msg.sender.id !== this.currentUser.id
    ).length;
  }

  isOwnMessage(message: Message): boolean {
    return message.sender.id === this.currentUser.id;
  }

  formatMessageTime(date: Date): string {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date >= today) {
      return date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
    } else if (date >= yesterday) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  }

  getParticipantsText(roomId: string): string {
    // This would normally come from your API
    // Just a mock implementation for now
    const counts = {
      '1': '5 participants',
      '2': '3 participants',
      '3': '8 participants',
      '4': '2 participants',
    };

    return counts[roomId as keyof typeof counts] || 'No participants';
  }

  // Mock data for demonstration
  private loadMockData(): void {
    // Mock rooms
    this.rooms = [
      { id: '1', name: 'General Chat' },
      { id: '2', name: 'Development Team' },
      { id: '3', name: 'Design Discussion' },
      { id: '4', name: 'Project Planning' },
    ];

    // Mock users
    const users: User[] = [
      { id: '1', username: 'CurrentUser' },
      { id: '2', username: 'JaneDoe' },
      { id: '3', username: 'BobSmith' },
    ];

    // Mock messages
    this.messages = [
      {
        id: '1',
        roomId: '1',
        sender: users[1],
        text: 'Hey everyone! Welcome to the general chat.',
        timestamp: new Date(Date.now() - 3600000 * 2),
        read: false,
      },
      {
        id: '2',
        roomId: '1',
        sender: users[2],
        text: 'Thanks for setting this up!',
        timestamp: new Date(Date.now() - 3600000),
        read: false,
      },
      {
        id: '3',
        roomId: '2',
        sender: users[1],
        text: "What's the status on the new feature?",
        timestamp: new Date(Date.now() - 86400000),
        read: true,
      },
      {
        id: '4',
        roomId: '2',
        sender: users[0],
        text: "I'm working on it now, should be done by tomorrow.",
        timestamp: new Date(Date.now() - 86400000 + 3600000),
        read: true,
      },
      {
        id: '5',
        roomId: '3',
        sender: users[2],
        text: "I've uploaded the new mockups for review.",
        timestamp: new Date(Date.now() - 172800000),
        read: true,
      },
    ];
  }
}
