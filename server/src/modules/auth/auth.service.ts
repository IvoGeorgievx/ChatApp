import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entity/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto, LoginUserDto } from '../user/dto/user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(data: CreateUserDto): Promise<User> {
    const userExists = await this.userRepo.findOne({
      where: { username: data.username },
    });

    if (userExists) throw new UnauthorizedException('User already exists');
    try {
      const hashedPassword = await bcrypt.hash(data.password, 10);
      const user = this.userRepo.create({
        ...data,
        password: hashedPassword,
      });

      return await this.userRepo.save(user);
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async signIn(data: LoginUserDto): Promise<{ accessToken: string }> {
    const { username, password } = data;
    const user = await this.userRepo.findOne({ where: { username } });
    if (!user) throw new UnauthorizedException('Wrong email or password');

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch)
      throw new UnauthorizedException('Wrong email or password');

    const payload = { sub: user.id, username: user.username };
    const accessToken = await this.jwtService.signAsync(payload);

    return { accessToken };
  }
}
