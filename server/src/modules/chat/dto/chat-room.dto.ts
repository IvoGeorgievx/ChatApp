import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const chatRoomSchema = z.object({
  name: z.string(),
});

export type ChatRoom = z.infer<typeof chatRoomSchema>;

export class ChatRoomDto extends createZodDto(chatRoomSchema) {}
