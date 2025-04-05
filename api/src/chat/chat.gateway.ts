import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly chatService: ChatService) {}

  @WebSocketServer() server: Server;

  private logger = new Logger('ChatGateway');

  afterInit() {
    this.logger.log(' websocket initialized');
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);

    const rooms = ['1', '2'];

    const randomRoom = rooms[Math.floor(Math.random() * rooms.length)];

    client.broadcast.emit('user-joined', {
      message: `new user with id: ${client.id} just joined the chat at room ${randomRoom}`,
    });

    client.join(randomRoom);

    this.logger.log(`Client ${client.id} joined room ${randomRoom}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    this.server.emit('user-left', {
      message: `user with id ${client.id} left the chat`,
    });
  }

  @SubscribeMessage('newMessage')
  create(client: Socket, message: CreateChatDto) {
    const rooms = Array.from(client.rooms).filter((room) => room !== client.id);

    if (rooms.length > 0) {
      const room = rooms[0];
      this.server.to(room).emit('reply', message);
      this.logger.log(
        `Message sent to room ${room}: ${JSON.stringify(message)}`,
      );
    } else {
      this.logger.warn(`Client ${client.id} is not in any room`);
    }
  }
}
