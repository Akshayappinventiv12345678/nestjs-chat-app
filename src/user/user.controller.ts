// users/users.controller.ts
import {
  Controller,
  Post,
  Body,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto } from './dto/registeruser.dto';
import { RoomInfoDto } from './dto/roominfo.dto';
import { retry } from 'rxjs';

@Controller('user')
export class UsersController {
  constructor(private userService: UserService) {}

  @Post('register')
  async register(@Body() body: RegisterUserDto) {
    console.log('register', body);
    return this.userService.createUser(body.username, body.password, 'user');
  }

  @Post('login')
  async login(@Body() body: RegisterUserDto) {
    console.log('login', body);
    return this.userService.signIn(body.username, body.password);
  }

  @Post('validate')
  async validate(@Req() req: Request) {
    const authHeader = (req.headers as { authorization?: string }).authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is missing');
    }

    const [bearer, token] = authHeader.split(' ');

    if (bearer !== 'Bearer' || !token) {
      throw new UnauthorizedException('Invalid authorization format');
    }
    console.log('VALIDATION', token);
    return this.userService.validateToken(token);
  }

  @Post('createroom')
  async createRoom(@Req() req: Request, @Body() body: RoomInfoDto) {
    const user = await this.validate(req);
    if (!user) {
      throw new UnauthorizedException('Authorised Path');
    }

    body.admin = user?.username;

    return await this.userService.createRoom(body);

  }
}
