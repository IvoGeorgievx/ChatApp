"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatGateway = void 0;
const common_1 = require("@nestjs/common");
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const chat_service_1 = require("./chat.service");
const create_chat_dto_1 = require("./dto/create-chat.dto");
let ChatGateway = class ChatGateway {
    constructor(chatService) {
        this.chatService = chatService;
        this.logger = new common_1.Logger('ChatGateway');
    }
    afterInit() {
        this.logger.log(' websocket initialized');
    }
    handleConnection(client) {
        this.logger.log(`Client connected: ${client.id}`);
        const rooms = ['1', '2'];
        const randomRoom = rooms[Math.floor(Math.random() * rooms.length)];
        client.broadcast.emit('user-joined', {
            message: `new user with id: ${client.id} just joined the chat at room ${randomRoom}`,
        });
        client.join(randomRoom);
        this.logger.log(`Client ${client.id} joined room ${randomRoom}`);
    }
    handleDisconnect(client) {
        this.logger.log(`Client disconnected: ${client.id}`);
        this.server.emit('user-left', {
            message: `user with id ${client.id} left the chat`,
        });
    }
    create(client, message) {
        const rooms = Array.from(client.rooms).filter((room) => room !== client.id);
        if (rooms.length > 0) {
            const room = rooms[0];
            this.server.to(room).emit('reply', message);
            this.logger.log(`Message sent to room ${room}: ${JSON.stringify(message)}`);
        }
        else {
            this.logger.warn(`Client ${client.id} is not in any room`);
        }
    }
};
exports.ChatGateway = ChatGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], ChatGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('newMessage'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, create_chat_dto_1.CreateChatDto]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "create", null);
exports.ChatGateway = ChatGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
        },
    }),
    __metadata("design:paramtypes", [chat_service_1.ChatService])
], ChatGateway);
//# sourceMappingURL=chat.gateway.js.map