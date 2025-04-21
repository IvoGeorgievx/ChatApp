import { Logger, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthGuard } from 'src/core/guards/auth.guard';
import { ChatService } from './chat.service';
import { ChatRoomDto, chatRoomSchema } from './dto/chat-room.dto';
import { CreateMessageDto, messageSchema } from './dto/message.dto';

interface SocketData {
  username: string;
  userId: string;
}
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly chatService: ChatService,
    private readonly jwtService: JwtService,
  ) {}
  private logger = new Logger('WebSocket');
  socket: Socket;
  server: Server;

  afterInit(server: Server) {
    this.server = server;
    this.logger.log('WebSocket server initialized');
  }

  handleConnection(client: Socket) {
    const token = client.handshake.headers.cookie?.split('=')[1];
    if (!token) return;
    const user = this.jwtService.verify<{ sub: string; username: string }>(
      token,
    );
    if (user) {
      client.data = { userId: user.sub, username: user.username } as SocketData;
      this.logger.log(
        `User ${user.sub} - ${user.username} connected with socket ID ${client.id}`,
      );
    } else {
      client.disconnect();
      this.logger.warn('Invalid token, client disconnected');
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`client disconnected: ${client.id}`);
  }

  @UseGuards(AuthGuard)
  @SubscribeMessage('newRoom')
  async createRoom(@MessageBody() body: ChatRoomDto) {
    const parsed = chatRoomSchema.safeParse(body);

    if (!parsed.success) {
      this.logger.error('Invalid chat room data', parsed.error.errors);
      // emit something for the error
      return;
    }
    try {
      const createdRoom = await this.chatService.createRoom(parsed.data);
      this.server.emit('roomCreated', createdRoom);
    } catch {
      this.logger.error('Couldn`t create room');
    }
  }

  // @UseGuards(AuthGuard)
  @SubscribeMessage('joinRoom')
  async joinRoom(
    @MessageBody() data: { roomId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const userId = (client.data as SocketData).userId;
    const room = await this.chatService.findRoomById(data.roomId);
    await client.join(room.id);
    this.logger.log(`User with id ${userId} joined room ${room.id}`);
  }

  @UseGuards(AuthGuard)
  @SubscribeMessage('newMessage')
  async receiveMessage(
    @MessageBody() body: CreateMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    const user = client.data as SocketData;
    const parsed = messageSchema.safeParse(body);
    if (!parsed.success) {
      this.logger.error('Invalid message data', parsed.error.errors);
      //same
    }
    const message = await this.chatService.newMessage(body, user.userId);
    this.server.to(message.chatRoom.id).emit('message', message);
  }
}
