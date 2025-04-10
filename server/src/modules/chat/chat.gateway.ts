import { Logger, UseGuards } from '@nestjs/common';
import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { ChatRoomDto, chatRoomSchema } from './dto/chat-room.dto';
import { AuthGuard } from 'src/core/guards/auth.guard';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
@UseGuards(AuthGuard)
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly chatService: ChatService) {}
  private logger = new Logger('WebSocket');
  socket: Socket;

  afterInit() {
    this.logger.log('WebSocket server initialized');
  }

  handleConnection(client: Socket) {
    this.logger.log(`client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`client disconnected: ${client.id}`);
  }

  @SubscribeMessage('newRoom')
  createRoom(@MessageBody() body: ChatRoomDto) {
    const parsed = chatRoomSchema.safeParse(body);

    if (!parsed.success) {
      this.logger.error('Invalid chat room data', parsed.error.errors);
      throw new Error('Invalid chat room data');
    }
    return this.chatService.createRoom(parsed.data);
  }
}
