import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RoomService } from 'src/room/room.service';
import { JoinRoomDto } from './dto/join-room.dto';
import { CreateParticipantDto } from 'src/participant/dto/create-participant.dto';
import { LeaveRoomDto } from './dto/leave-room.dto';

@WebSocketGateway()
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly roomService: RoomService) {}

  afterInit(server: Server) {
    server;
    console.log('Web Socket initialised ');
  }
  handleConnection(client: Socket, ...args: any[]) {
    args;

    console.log(`Client connected ${client.id}`);
  }
  handleDisconnect(client: Socket) {
    this.roomService.handleDisconnectParticipant(client.id);
    console.log(`Client disconnected ${client.id}`);
  }

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('join')
  async joinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() message: JoinRoomDto,
  ) {
    const creatingParticipant: CreateParticipantDto = {
      name: message.name,
      socketID: client.id,
    };

    try {
      const participant = await this.roomService.addParticipant(
        creatingParticipant,
        message.roomID,
      );

      client.join(message.roomID);

      this.server.to(message.roomID).emit('palJoined', participant);
    } catch (e) {
      console.log(e);
    }
  }

  @SubscribeMessage('leave')
  async leaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() message: LeaveRoomDto,
  ) {
    const leftParticipant = await this.roomService.handleLeave(
      client.id,
      message,
    );

    client.leave(message.roomID);

    this.server.to(message.roomID).emit('palLeft', leftParticipant);
  }
}
