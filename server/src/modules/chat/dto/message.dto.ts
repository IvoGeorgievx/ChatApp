import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const messageSchema = z.object({
  content: z.string(),
  roomId: z.string(),
});

export type Message = z.infer<typeof messageSchema>;

export class CreateMessageDto extends createZodDto(messageSchema) {}
