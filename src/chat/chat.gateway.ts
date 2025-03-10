import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*', // Adjust this for production security
  },
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private connectedClients: Map<string, Socket> = new Map();

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
    this.connectedClients.set(client.id, client);
    this.server.emit('clientConnected', { clientId: client.id }); // Broadcast connection
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
  handleJoinRoom(client: Socket, room: string): void {
    console.log(`Client ${client.id} joining room: ${room}`);
    client.join(room);
    this.server.to(room).emit('userJoined', { user: client.id, room }); //Notify room members
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(client: Socket, room: string): void {
    console.log(`Client ${client.id} leaving room: ${room}`);
    client.leave(room);
    this.server.to(room).emit('userLeft', { user: client.id, room }); //Notify room members
  }

  @SubscribeMessage('roomMessage')
  handleRoomMessage(
    client: Socket,
    payload: { room: string; message: any },
  ): void {
    console.log(
      `Room message from ${client.id} to ${payload.room}:`,
      payload.message,
    );
    this.server.to(payload.room).emit('roomMessage', { sender: client.id, message: payload.message });
  }
}
