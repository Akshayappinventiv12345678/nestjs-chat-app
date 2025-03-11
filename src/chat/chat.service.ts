import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

const roomInfoCollection = "room_metadata";

@Injectable()
export class ChatService {
  constructor(
    // @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectConnection() private readonly connection: Connection,
    // private readonly jwtService: JwtService,
  ) {}

  async addMessageToRoom(roomId: string, sender: string, text: string, role: string) {
    try {
      const collectionName = `room_${roomId}`; // Collection name = room ID
      const db = this.connection.db;

      if (!db) {
        throw new InternalServerErrorException('Database connection not available');
      }
      const collections = await db.listCollections({ name: collectionName }).toArray();
      const timestamp = new Date();

      const roomCollection = db.collection(collectionName);
      const newMessage = {
        sender,
        text,
        role,
        roomId,
        timestamp: new Date(),
      };
      console.log(collections.length, 'collection length');

      if (collections.length === 0) {
        console.log(`Creating new collection: ${collectionName}`);

        // Create a metadata document for the room
        const metaCollection = db.collection('roomInfoCollection');

        await metaCollection.insertOne({
          roomId,
          createdAt: new Date(),
          lastUpdatedAt: new Date(),
          lastMessage: text,
          totalMessages: 1,
        });
      } else {
        // Update metadata when a new message is added
        const metaCollection = db.collection(roomInfoCollection);
        await metaCollection.updateOne(
          { roomId },
          {
            $set: { lastUpdatedAt: timestamp, lastMessage: text },
            $inc: { totalMessages: 1 },
          },
        );
      }

      const dbresp = await roomCollection.insertOne(newMessage);
      console.log('db response', dbresp);
      return newMessage;
    } catch (error) {
      throw new InternalServerErrorException(`Error adding message: ${error}`);
    }
  }
}
