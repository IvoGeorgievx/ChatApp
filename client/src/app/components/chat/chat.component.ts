import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ChatService } from '../../services/chat.service';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  imports: [ReactiveFormsModule, DatePipe, CommonModule],
})
export class ChatComponent implements OnInit, OnDestroy {
  messageForm: FormGroup;
  connectionForm: FormGroup;

  private chatService = inject(ChatService);
  private fb = inject(FormBuilder);

  // Access signals directly from the service
  messages = this.chatService.messages;
  connectionStatus = this.chatService.status;
  username = this.chatService.currentUser;

  constructor() {
    this.messageForm = this.fb.group({
      message: ['', Validators.required],
    });

    this.connectionForm = this.fb.group({
      serverUrl: ['http://localhost:3005', Validators.required],
      username: [
        'User_' + Math.floor(Math.random() * 1000),
        Validators.required,
      ],
    });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.chatService.disconnect();
  }

  connect(): void {
    if (this.connectionForm.valid) {
      const { serverUrl, username } = this.connectionForm.value;
      this.chatService.connect(serverUrl, username);
    }
  }

  disconnect(): void {
    this.chatService.disconnect();
  }

  sendMessage(): void {
    if (this.messageForm.valid && this.chatService.isConnected()) {
      this.chatService.sendMessage(this.messageForm.value.message);
      this.messageForm.reset();
    }
  }

  isConnected(): boolean {
    return this.chatService.isConnected();
  }
}
