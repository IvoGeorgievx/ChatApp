import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

const baseUserSchema = z.object({
  username: z.string(),
  password: z.string(),
});

const createUserSchema = z.object(baseUserSchema.shape);
const updateUserSchema = z.object(baseUserSchema.shape);
const loginUserSchema = z.object(baseUserSchema.shape);

export type User = z.infer<typeof createUserSchema>;

export class CreateUserDto extends createZodDto(createUserSchema) {}
export class UpdateUserDto extends createZodDto(updateUserSchema) {}
export class LoginUserDto extends createZodDto(loginUserSchema) {}
