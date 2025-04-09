import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '../user/entity/user.entity';
import { CreateUserDto, LoginUserDto } from '../user/dto/user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  signUp(@Body() body: CreateUserDto): Promise<User> {
    return this.authService.signUp(body);
  }

  @Post('sign-in')
  signIn(@Body() body: LoginUserDto): Promise<{ accessToken: string }> {
    return this.authService.signIn(body);
  }
}
