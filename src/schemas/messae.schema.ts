import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Message extends Document {
  @Prop({ required: true })
  roomId: string;

  @Prop({ required: true })
  senderId: string;

  @Prop({ required: true })
  text: string;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
