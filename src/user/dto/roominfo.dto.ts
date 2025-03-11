import { IsString, IsArray, IsNumber, IsDate, IsOptional } from 'class-validator';

export class RoomInfoDto {
  @IsArray()
  @IsString({ each: true })
  participants: string[]; // Sender's ID or username

  @IsString()
  group_type: string; // multi or single (one-to-one)

  @IsString()
  roomId: string; // ID of the chat room

  @IsOptional()
  @IsString()
  lastMessage: string; // Stores the last message text

  @IsOptional()
  @IsNumber()
  totalMessages: number; // Stores the total number of messages sent in the room

  @IsOptional()
  @IsDate()
  createdAt: Date; // When the chat room was created

  @IsOptional()
  @IsDate()
  updatedAt: Date; // When the chat room was last updated

  @IsOptional()
  @IsString()
  admin: string;
}
