// import { Injectable } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// import { Room } from '../schemas/room.schema';
// import { Message } from '../schemas/messae.schema';

// @Injectable()
// export class DatabaseSyncService {
//   constructor(
//     @InjectModel(Room.name) private roomModel: Model<Room>,
//     @InjectModel(Message.name) private messageModel: Model<Message>,
//   ) {}

//   async updateRoomMetadata(roomId: string, lastMessage: string) {
//     const messageCount = await this.messageModel.countDocuments({ roomId });
//     await this.roomModel.findOneAndUpdate({ roomId }, { lastMessage, messageCount }, { upsert: true });
//   }
// }
