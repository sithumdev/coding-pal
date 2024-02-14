import { Module } from '@nestjs/common';
import { RoomModule } from 'src/room/room.module';
import { ChatGateway } from './chat.gateway';

@Module({
  imports: [RoomModule],
  providers: [ChatGateway],
})
export class ChatModule {}
