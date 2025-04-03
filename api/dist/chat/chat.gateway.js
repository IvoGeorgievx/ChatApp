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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const chat_service_1 = require("./chat.service");
const create_chat_dto_1 = require("./dto/create-chat.dto");
const update_chat_dto_1 = require("./dto/update-chat.dto");
const socket_io_1 = require("socket.io");
const common_1 = require("@nestjs/common");
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
        this.server.emit('user joined', {
            message: `new client with id: ${client.id} just joined the chat`,
        });
    }
    handleDisconnect(client) {
        this.logger.log(`Client disconnected: ${client.id}`);
    }
    create(body, client) {
        console.log(body);
        client.emit('reply', 'this is a reply');
        this.server.emit('message', body);
        return this.chatService.create(body);
    }
    findAll() {
        return this.chatService.findAll();
    }
    findOne(id) {
        return this.chatService.findOne(id);
    }
    update(updateChatDto) {
        return this.chatService.update(updateChatDto.id, updateChatDto);
    }
    remove(id) {
        return this.chatService.remove(id);
    }
};
exports.ChatGateway = ChatGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], ChatGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('createChat'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true })),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_chat_dto_1.CreateChatDto, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "create", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('findAllChat'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "findAll", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('findOneChat'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "findOne", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('updateChat'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_chat_dto_1.UpdateChatDto]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "update", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('removeChat'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "remove", null);
exports.ChatGateway = ChatGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
        },
    }),
    __metadata("design:paramtypes", [chat_service_1.ChatService])
], ChatGateway);
//# sourceMappingURL=chat.gateway.js.map