import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatRoom } from './entity/chat-room.entity';
import { Message } from './entity/message.entity';
import { User } from '../user/entity/user.entity';
import { AuthGuard } from 'src/core/guards/auth.guard';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChatRoom, Message, User]),
    JwtModule.register({
      secret: 'big_secret',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [ChatGateway, ChatService, AuthGuard],
})
export class ChatModule {}
