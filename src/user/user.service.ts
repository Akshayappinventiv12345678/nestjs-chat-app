// users/users.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../schemas/users.schema';
// import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findOne(username: string): Promise<User | null> {
    return this.userModel.findOne({ username }).exec();
  }

  async createUser(username: string, password: string): Promise<User> {
    // const hashedPassword = await bcrypt.hash(password, 10);
    return this.userModel.create({ username, password });
  }
}
