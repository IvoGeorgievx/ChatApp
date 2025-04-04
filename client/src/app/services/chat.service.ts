import { computed, Injectable, signal } from '@angular/core';
import { io, Socket } from 'socket.io-client';

interface ChatMessage {
  sender: string;
  message: string;
  timestamp?: Date;
}

interface SystemMessage {
  message: string;
  timestamp: Date;
  type: 'joined' | 'left' | 'info';
}

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private socket: Socket | null = null;
  private username = signal<string>('');
  private connectionStatus = signal<
    'connected' | 'disconnected' | 'connecting' | 'error'
  >('disconnected');

  private messagesSignal = signal<(ChatMessage | SystemMessage)[]>([]);

  public messages = computed(() => this.messagesSignal());
  public status = computed(() => this.connectionStatus());
  public currentUser = computed(() => this.username());

  connect(url: string, username: string): void {
    this.username.set(username);
    this.connectionStatus.set('connecting');

    this.socket = io(url, {
      transports: ['websocket'],
      autoConnect: true,
      reconnection: true,
    });

    this.socket.on('connect', () => {
      console.log('Socket.io connection established');
      this.connectionStatus.set('connected');
    });

    this.socket.on('user-joined', (data: any) => {
      console.log('User joined:', data);
      this.addSystemMessage(data.message, 'joined');
    });

    this.socket.on('newMessage', (message: any) => {
      console.log('New message received:', message);
      this.addMessage(message);
    });

    this.socket.on('user-left', (data: any) => {
      console.log('User left the chat', data);
      this.addSystemMessage(data.message, 'left');
    });

    this.socket.on('reply', (message: any) => {
      console.log('Reply received:', message);
      if (typeof message === 'object') {
        this.addMessage(message);
      }
    });

    this.socket.on('disconnect', () => {
      console.log('Socket.io connection closed');
      this.connectionStatus.set('disconnected');
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket.io connection error:', error);
      this.connectionStatus.set('error');
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
      this.connectionStatus.set('disconnected');
    }
  }

  private addSystemMessage(
    message: string,
    type: 'joined' | 'left' | 'info'
  ): void {
    const systemMessage: SystemMessage = {
      message,
      timestamp: new Date(),
      type,
    };
    this.messagesSignal.update((messages) => [...messages, systemMessage]);
    console.log(this.messagesSignal());
  }

  sendMessage(content: string): void {
    if (this.socket && this.socket.connected) {
      const message: ChatMessage = {
        sender: this.username(),
        message: content,
        timestamp: new Date(),
      };

      this.socket.emit('newMessage', message);
    } else {
      console.error('Socket.io is not connected');
    }
  }

  addMessage(message: ChatMessage): void {
    this.messagesSignal.update((messages) => [...messages, message]);
  }

  clearMessages(): void {
    this.messagesSignal.set([]);
  }

  isConnected(): boolean {
    return this.connectionStatus() === 'connected';
  }
}
