// users/users.controller.ts
import { Controller, Post, Body, Get } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UsersController {
  constructor(private userService: UserService) {}

  @Get()
  getHello(): string {
    return `hello`;
  }

  @Post('register')
  async register(@Body() body: { username: string; password: string }) {
    return this.userService.createUser(body.username, body.password);
  }

}
