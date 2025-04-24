import {
  AfterViewChecked,
  Component,
  ElementRef,
  inject,
  OnInit,
  viewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ChatRoom, Message } from '../../types/chat.type';
import { User } from '../../types/user.type';
import { HeaderComponent } from '../header/header.component';
import { ChatService } from '../../../core/services/chat/chat.service';
import { AuthService } from '../../../core/services/auth/auth.service';
import { Subscription, tap } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HeaderComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit, AfterViewChecked {
  chatService = inject(ChatService);
  authService = inject(AuthService);
  route = inject(ActivatedRoute);

  roomId: string | null = null;
  rooms: ChatRoom[] = [];
  filteredRooms: ChatRoom[] = [];
  selectedRoom: ChatRoom | null = null;
  roomSearchQuery: string = '';

  messageContainer = viewChild<ElementRef<HTMLDivElement>>('messagesContainer');
  roomNameInput = viewChild<ElementRef<HTMLInputElement>>('roomNameInput');
  modalDialogIsHidden = true;

  currentUser: User | null | undefined = this.authService.currentUser();

  messages: Message[] = [];
  newMessage: string = '';
  newRoomName: string = '';
  messageSubscription: Subscription | null = null;
  roomCreation: Subscription | null = null;

  ngOnInit(): void {
    this.loadRooms();
    this.filterRooms();

    this.messageSubscription = this.chatService
      .recieveMessage()
      .subscribe((message: Message) => {
        const roomToPushMessage = this.rooms.find(
          (room) => room.id === this.selectedRoom?.id
        );
        roomToPushMessage?.messages.push(message);
      });

    this.roomCreation = this.chatService
      .roomCreated()
      .subscribe((room: ChatRoom) => {
        this.filteredRooms.push(room);
      });
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    const container = this.messageContainer();
    if (container && container.nativeElement) {
      container.nativeElement.scrollTop = container.nativeElement.scrollHeight;
    }
  }

  private handleRoomSelection() {
    this.roomId = this.route.snapshot.paramMap.get('roomId');
    if (!this.roomId) return;

    const room = this.rooms.find((room) => room.id === this.roomId);
    if (!room) return;

    return this.selectRoom(room);
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
        this.filteredRooms = this.rooms;
        this.handleRoomSelection();
      });
  }

  openRoomModal(): void {
    this.modalDialogIsHidden = false;
    setTimeout(() => {
      this.roomNameInput()?.nativeElement.focus();
    });
  }

  createRoom(): void {
    if (!this.newRoomName.trim()) {
      console.error('Room name cannot be empty');
      return;
    }
    this.chatService.createRoom(this.newRoomName);
    this.newRoomName = '';
    this.closeModal();
  }

  closeModal(): void {
    this.modalDialogIsHidden = true;
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
  }

  getMessages(roomId: string): Message[] {
    const room = this.rooms.find((room) => room.id === roomId);
    const messages = room?.messages.sort((a: Message, b: Message) => {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });
    return messages ? messages : [];
  }

  sendMessage(): void {
    if (!this.newMessage.trim() || !this.selectedRoom) return;
    this.chatService.sendMessage(this.newMessage, this.selectedRoom);

    const newMsg: Message = {
      // id: Date.now().toString(),
      content: this.newMessage,
      roomId: this.selectedRoom.id,
      sender: this.currentUser!,
      createdAt: new Date(),
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

  isOwnMessage(message: Message): boolean {
    console.log(message.sender.id);
    console.log(this.currentUser);
    return message.sender.id === this.currentUser?.id;
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
    const counts = {
      '1': '5 participants',
      '2': '3 participants',
      '3': '8 participants',
      '4': '2 participants',
    };

    return counts[roomId as keyof typeof counts] || 'No participants';
  }
}
