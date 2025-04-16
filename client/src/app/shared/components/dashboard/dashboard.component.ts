import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ChatRoom, Message } from '../../types/chat.type';
import { User } from '../../types/user.type';
import { HeaderComponent } from '../header/header.component';
import { ChatService } from '../../../core/services/chat/chat.service';
import { AuthService } from '../../../core/services/auth/auth.service';
import { tap } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HeaderComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  chatService = inject(ChatService);
  authService = inject(AuthService);

  rooms: ChatRoom[] = [];
  filteredRooms: ChatRoom[] = [];
  selectedRoom: ChatRoom | null = null;
  roomSearchQuery: string = '';

  currentUser: User | null | undefined = this.authService.currentUser();

  messages: Message[] = [];
  newMessage: string = '';

  ngOnInit(): void {
    this.loadRooms();
    this.filterRooms();
    // this.loadMessages();
  }

  loadRooms(): void {
    this.chatService
      .getCurrentRooms()
      .pipe(
        tap((data: ChatRoom[]) =>
          data.forEach((room) => {
            this.messages.push(...room.messages);
          })
        )
      )
      .subscribe((data) => {
        this.rooms = data;
        console.log(this.messages);
      });
  }

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

  selectRoom(room: ChatRoom): void {
    console.log(room);
    this.chatService.joinRoom(room.id);
    this.selectedRoom = room;

    // this.messages.forEach((msg) => {
    //   if (msg.roomId === room.id && msg.sender.id !== this.currentUser?.id) {
    //     msg.read = true;
    //   }
    // });
  }

  getMessages(roomId: string): Message[] {
    return this.messages.filter((msg) => msg.roomId === roomId);
  }

  sendMessage(): void {
    if (!this.newMessage.trim() || !this.selectedRoom) return;
    this.chatService.sendMessage(this.newMessage, this.selectedRoom);

    const newMsg: Message = {
      // id: Date.now().toString(),
      content: this.newMessage,
      roomId: this.selectedRoom.id,
      sender: this.currentUser!,
    };

    this.messages.push(newMsg);
    this.newMessage = '';
  }

  // Helper methods for UI
  // getLastMessage(roomId: string): string {
  //   const roomMessages = this.messages
  //     .filter((msg) => msg.roomId === roomId)
  //     .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  //   if (roomMessages.length === 0) return 'No messages yet';

  //   const lastMsg = roomMessages[0];
  //   return lastMsg.text.length > 30
  //     ? lastMsg.text.substring(0, 27) + '...'
  //     : lastMsg.text;
  // }

  // getLastMessageTime(roomId: string): string {
  //   const roomMessages = this.messages
  //     .filter((msg) => msg.roomId === roomId)
  //     .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  //   if (roomMessages.length === 0) return '';

  //   const lastMsg = roomMessages[0];
  //   return this.formatMessageTime(lastMsg.timestamp);
  // }

  // getUnreadCount(roomId: string): number {
  //   return this.messages.filter(
  //     (msg) =>
  //       msg.roomId === roomId &&
  //       !msg.read &&
  //       msg.sender.id !== this.currentUser?.id
  //   ).length;
  // }

  // isOwnMessage(message: Message): boolean {
  //   return message.sender.id === this.currentUser?.id;
  // }

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
    const counts = {
      '1': '5 participants',
      '2': '3 participants',
      '3': '8 participants',
      '4': '2 participants',
    };

    return counts[roomId as keyof typeof counts] || 'No participants';
  }
}
