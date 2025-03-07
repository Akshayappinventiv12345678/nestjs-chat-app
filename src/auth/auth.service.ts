import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../schemas/users.schema';
// import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async register(username: string, password: string) {
    // const hashedPassword = await bcrypt.hash(password, 10);
    return this.userModel.create({ username, password });
  }

  async validateUser(username: string, password: string) {
    const user = await this.userModel.findOne({ username });
    if (user && password === user.password) {
      return user;
    }
    return null;
  }
}
