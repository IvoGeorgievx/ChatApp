import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ChatRoom } from '../../../shared/types/chat.type';
import { Socket, SocketIoConfig } from 'ngx-socket-io';
import { CookieService } from 'ngx-cookie-service';

const config: SocketIoConfig = { url: 'http://localhost:3005', options: {} };

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private socket = new Socket(config);
  constructor(
    private readonly http: HttpClient,
    private readonly cookieService: CookieService
  ) {}

  getCurrentRooms(): Observable<ChatRoom[]> {
    return this.http.get<ChatRoom[]>('http://localhost:3005/chats');
  }

  getRoomMessages(roomId: string): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:3005/chats/:${roomId}`);
  }

  joinRoom(roomId: string): void {
    this.socket.emit('joinRoom', { roomId });
  }

  authError() {
    return this.socket.on('auth_error', (msg) => {
      console.error(msg);
    });
  }

  sendMessage(text: string, room: ChatRoom): void {
    this.socket.emit('newMessage', { content: text, roomId: room.id });
  }
}
