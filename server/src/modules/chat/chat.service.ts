import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entity/user.entity';
import { Repository } from 'typeorm';
import { ChatRoom } from './entity/chat-room.entity';
import { ChatRoomDto } from './dto/chat-room.dto';
import { Message } from './entity/message.entity';
import { CreateMessageDto } from './dto/message.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(ChatRoom)
    private readonly chatRoomRepo: Repository<ChatRoom>,
    @InjectRepository(Message)
    private readonly messageRepo: Repository<Message>,
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

  async newMessage(body: CreateMessageDto, userId: string): Promise<Message> {
    const { roomId, content } = body;

    const sender = await this.userRepo.findOne({
      where: {
        id: userId,
      },
    });

    if (!sender) {
      throw new BadRequestException('Sender not found');
    }

    const chatRoom = await this.chatRoomRepo.findOne({ where: { id: roomId } });
    if (!chatRoom) {
      throw new BadRequestException('Chat room not found');
    }

    const newMessage = this.messageRepo.create({
      content,
      chatRoom,
      sender,
    });

    try {
      return await this.messageRepo.save(newMessage);
    } catch (err: unknown) {
      console.error('Error during message save:', err);
      if (err instanceof Error) {
        throw new BadRequestException(err.message);
      }
      throw new BadRequestException('An unknown error occurred');
    }
  }

  async findRoomById(roomId: string): Promise<ChatRoom> {
    const room = await this.chatRoomRepo.findOne({
      where: {
        id: roomId,
      },
    });

    if (!room) {
      throw new BadRequestException('Chat room not found');
    }

    return room;
  }

  async getAllChatRooms(): Promise<ChatRoom[]> {
    return await this.chatRoomRepo.find({
      relations: {
        messages: true,
      },
    });
  }

  // async getChatMessages(roomId: string): Promise<ChatRoom[]> {
  //   return await this.chatRoomRepo.find({
  //     where: {
  //       id: roomId,
  //     },
  //   });
  // }
}
