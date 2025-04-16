import { Controller, Get, Param } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chats')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get()
  getAllChatRooms() {
    return this.chatService.getAllChatRooms();
  }

  // @Get(':id')
  // getRoomMessage(@Param('id') id: string) {
  //   return this.chatService.getChatMessages(id);
  // }
}
