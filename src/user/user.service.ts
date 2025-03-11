// users/users.service.ts
import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { User } from '../schemas/users.schema';
import { JwtService } from '@nestjs/jwt';
import { RoomInfo } from 'src/schemas/roominfo.schema';
import { RoomInfoDto } from './dto/roominfo.dto';

const roomInfoCollection = 'room_metadata';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectConnection() private readonly connection: Connection,
    private jwtService: JwtService,
  ) {}

  async findOne(username: string): Promise<User | null> {
    try {
      const user = await this.userModel.findOne({ username }).exec();
      if (!user) {
        return null;
      }
      return user;
    } catch (error) {
      console.error('Error finding user:', error);
      throw new InternalServerErrorException('Failed to find user.');
    }
  }

  async createUser(username: string, password: string, role: string): Promise<User> {
    try {
      const newUser = await this.userModel.create({ username, password, role });
      return newUser;
    } catch (error) {
      console.error('Error creating user:', error);
      // Duplicate key error (username already exists)
      throw new BadRequestException('Error creating user');
    }
  }

  async signIn(username: string, pass: string): Promise<{ access_token: string }> {
    const user = await this.findOne(username);
    if (user?.password !== pass) {
      throw new UnauthorizedException('wrong username or password');
    }
    const payload = { sub: user._id, username: user.username };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async validateToken(access_token: string): Promise<User | null> {
    try {
      return this.jwtService.decode(access_token);
    } catch (error) {
      console.error('Error Decoding Token:', error);
      throw new InternalServerErrorException('acess token error');
    }
  }

  async createRoom(body: RoomInfoDto) {
    try {
      // Collection name = room ID
      const db = this.connection.db;

      if (!db) {
        throw new InternalServerErrorException('Database connection not available');
      }

      const ob = {
        createdAt: new Date(),
        lastUpdatedAt: new Date(),
        lastMessage: null,
        totalMessages: 0,
      };

      // Create a metadata document for the room
      const metaCollection = db.collection(roomInfoCollection);
      const groupinfo = Object.assign({}, ob, body);

      const resp = await metaCollection.insertOne(groupinfo);
      console.log(' created meta info ', resp, groupinfo);

      return resp;
    } catch (error) {
      throw new InternalServerErrorException(`Error adding message: ${error}`);
    }
  }
}
