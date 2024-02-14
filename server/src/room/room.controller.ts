import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { RoomService } from './room.service';

@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post()
  create(@Body() createRoomDto: CreateRoomDto) {
    return this.roomService.create(createRoomDto);
  }

  @Get(':roomID/participant')
  findAllParticipantsInRoom(@Param('roomID') roomID: string) {
    return this.roomService.findAllParticipants(roomID);
  }

  // @Get('participant')
  // findAllParticipants() {
  //   return this.participantService.findAll();
  // }

  @Get(':roomID')
  findOne(@Param('roomID') roomID: string) {
    return this.roomService.findOne(roomID);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateRoomDto: UpdateRoomDto) {
  //   return this.roomService.update(+id, updateRoomDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.roomService.remove(+id);
  // }
}
