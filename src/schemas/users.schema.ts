import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password: string; // Hashed password

  @Prop({ default: [] })
  rooms: string[]; // List of room IDs
}

export const UserSchema = SchemaFactory.createForClass(User);
