import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entity/user.entity';
import { Repository } from 'typeorm';
import { ChatRoom } from './entity/chat-room.entity';
import { ChatRoomDto } from './dto/chat-room.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(ChatRoom)
    private readonly chatRoomRepo: Repository<ChatRoom>,
  ) {}

  async createRoom(body: ChatRoomDto): Promise<ChatRoom> {
    const newRoom = this.chatRoomRepo.create({
      name: body.name,
    });

    try {
      return await this.chatRoomRepo.save(newRoom);
    } catch (error) {
      console.error('Error during save:', error);
      throw new BadRequestException(error);
    }
  }
}
