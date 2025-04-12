import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ChatRoom } from '../../../shared/types/chat.type';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(private readonly http: HttpClient) {}

  getCurrentRooms(): Observable<ChatRoom[]> {
    return this.http.get<ChatRoom[]>('http://localhost:3005/chats');
  }
}
