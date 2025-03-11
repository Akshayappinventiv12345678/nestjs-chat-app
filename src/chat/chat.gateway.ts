import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt'; // Import JwtService
import { UserService } from 'src/user/user.service';
import { ChatService } from './chat.service';

@WebSocketGateway({
  cors: {
    origin: '*', // Adjust this for production security
  },
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private connectedClients: Map<string, Socket> = new Map();

  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly chatService: ChatService,
  ) {}

  private extractTokenFromSocket(client: Socket): string | undefined {
    const authHeader = client.handshake.headers.authorization;
    if (authHeader && authHeader.split(' ')[0] === 'Bearer') {
      return authHeader.split(' ')[1];
    }
    return undefined;
  }

  async handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
    try {
      const token = this.extractTokenFromSocket(client);
      if (!token) {
        throw new WsException('Unauthorized: Token missing');
      }

      const payload = await this.jwtService.verifyAsync(token);
      console.log(token,payload);

      const user = await this.userService.findOne(payload.username); // Assuming you have findById
      if (!user) {
        throw new WsException('Unauthorized: User not found');
      }

      client.data.user = user; // Attach user to socket data

      console.log(`Client connected: ${client.id}, User: ${user.username}`);
      this.connectedClients.set(client.id, client);
      this.server.emit('clientConnected', { clientId: client.id, username: user.username });
    } catch (error) {
      console.error('Connection error:', error);
      client.emit('exception', { message: error.message });
      client.disconnect(true); // Disconnect on auth failure
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    this.connectedClients.delete(client.id);
    this.server.emit('clientDisconnected', { clientId: client.id }); // Broadcast disconnection
  }

  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: any): void {
    console.log(`Message from ${client.id}:`, payload);

    // Broadcast the message to all connected clients
    this.server.emit('message', {
      sender: client.id,
      ...payload,
    });
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: Socket, room: string) {
    let username = client.data.user.username;
    console.log(`Client ${username} joining room: ${room}`);
    client.join(room);
    this.server.to(room).emit('userJoined', { user: username, room }); //Notify room members
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(client: Socket, room: string): void {
    let username=client.data.user.username;
    console.log(`Client ${username} leaving room: ${room}`);
    client.leave(room);
    this.server.to(room).emit('userLeft', { user: username, room }); //Notify room members
  }

  @SubscribeMessage('roomMessage')
  async handleRoomMessage(client: Socket,payload: { room: string; message: any }) {
    let username=client.data.user.username;
    console.log(`Room message from ${username} to ${payload.room}:`, payload.message);

    await this.chatService.addMessageToRoom(payload.room, username, payload.message, 'user');
    // add database sync here
    this.server.to(payload.room).emit('roomMessage', { sender: username, message: payload.message });
  }
}
