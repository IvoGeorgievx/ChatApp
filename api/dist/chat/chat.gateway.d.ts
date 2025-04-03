import { OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { Server, Socket } from 'socket.io';
export declare class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private readonly chatService;
    constructor(chatService: ChatService);
    server: Server;
    private logger;
    afterInit(): void;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    create(body: CreateChatDto, client: Socket): string;
    findAll(): string;
    findOne(id: number): string;
    update(updateChatDto: UpdateChatDto): string;
    remove(id: number): string;
}
