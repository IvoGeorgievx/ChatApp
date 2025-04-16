import { User } from './user.type';

export interface Message {
  id?: string;
  content: string;
  sender: User;
  roomId: string;
}

export interface ChatRoom {
  id: string;
  name: string;
  messages: Message[];
}
