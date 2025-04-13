import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '../user/entity/user.entity';
import { CreateUserDto, LoginUserDto } from '../user/dto/user.dto';
import { AuthGuard } from 'src/core/guards/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  signUp(@Body() body: CreateUserDto): Promise<User> {
    return this.authService.signUp(body);
  }

  @UseGuards(AuthGuard)
  @Post('sign-in')
  signIn(@Body() body: LoginUserDto): Promise<{ accessToken: string }> {
    return this.authService.signIn(body);
  }
}
