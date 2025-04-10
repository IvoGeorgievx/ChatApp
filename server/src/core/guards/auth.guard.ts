import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Socket } from 'socket.io';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (context.getType() === 'http') {
      const request: Request = context.switchToHttp().getRequest();
      const authorization = request.headers['authorization'];
      const token = authorization?.split(' ')[1];

      if (!token) return false;
      try {
        await this.jwtService.verifyAsync(token);
        return true;
      } catch {
        return false;
      }
    }

    if (context.getType() === 'ws') {
      const client: Socket = context.switchToWs().getClient();
      const headers = client.handshake.headers['authorization'];
      const token = headers?.split(' ')[1];
      if (!token) {
        client.emit('auth_error', {
          message: 'Auth token is not valid or missing',
        });
        return false;
      }

      try {
        await this.jwtService.verifyAsync(token);
        return true;
      } catch {
        client.emit('auth_error', {
          message: 'Auth token is not valid or missing',
        });

        return false;
      }
    }
    return true;
  }
}
