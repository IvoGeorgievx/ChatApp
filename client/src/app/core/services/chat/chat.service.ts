import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ChatRoom } from '../../../shared/types/chat.type';
import { Socket, SocketIoConfig } from 'ngx-socket-io';

const config: SocketIoConfig = { url: 'http://localhost:3005', options: {} };

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private socket = new Socket(config);
  constructor(private readonly http: HttpClient) {}

  getCurrentRooms(): Observable<ChatRoom[]> {
    return this.http.get<ChatRoom[]>('http://localhost:3005/chats');
  }

  joinRoom(roomId: string): void {
    this.socket.emit('joinRoom', { roomId });
  }

  authError() {
    return this.socket.on('auth_error', (msg) => {
      console.error(msg);
    });
  }
}
