import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Message extends Document {
  @Prop({ required: true })
  sender: string; // Sender's ID or username

  @Prop({ required: true })
  text: string; // Message content

  @Prop({ required: true, default: 'user' })
  role: string; // Sender's role (e.g., 'user', 'admin')

  @Prop({ required: true })
  roomId: string; // ID of the chat room

  @Prop({ default: Date.now })
  timestamp: Date; // Timestamp when the message was sent
}

export const MessageSchema = SchemaFactory.createForClass(Message);
