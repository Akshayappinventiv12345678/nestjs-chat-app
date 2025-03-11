import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatService } from './chat.service';
import { RoomInfo, RoomSchema } from 'src/schemas/roominfo.schema';
import { Message, MessageSchema } from 'src/schemas/messae.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RoomInfo.name, schema: RoomSchema }, // ✅ Room Schema
      { name: Message.name, schema: MessageSchema }, // ✅ Message Schema
    ]),
  ],
  providers: [ChatService], // ✅ ChatService is provided here
  exports: [ChatService], // ✅ Make it available for other modules
})
export class ChatModule {}
