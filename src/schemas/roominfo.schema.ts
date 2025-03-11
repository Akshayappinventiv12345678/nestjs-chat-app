import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class RoomInfo extends Document {
  @Prop({ required: true })
  participants: string[]; // Sender's ID or username

  @Prop({ required: true })
  group_type: string; // multi or single ie. one to one

  @Prop({ required: true })
  text: string; // Message content

  @Prop({ required: true, default: 'user' })
  role: string; // Sender's role (e.g., 'user', 'admin')

  @Prop({ required: true })
  roomId: string; // ID of the chat room

  @Prop()
  lastMessage: string; // Stores the last message text

  @Prop({ default: 0 })
  totalMessages: number; // Stores the total number of messages sent in the room

  @Prop({ default: Date.now })
  createdAt: Date; // When the chat room was created

  @Prop({ default: Date.now })
  updatedAt: Date; // When the chat room was last updated
}

export const RoomSchema = SchemaFactory.createForClass(RoomInfo);
