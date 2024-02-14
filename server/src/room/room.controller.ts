import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateParticipantDto } from 'src/participant/dto/create-participant.dto';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { RoomService } from './room.service';

@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post()
  create(@Body() createRoomDto: CreateRoomDto) {
    return this.roomService.create(createRoomDto);
  }

  @Post(':roomID/participant')
  addPartcipant(
    @Body() createParticipantDto: CreateParticipantDto,
    @Param('roomID') roomID: string,
  ) {
    return this.roomService.addParticipant(createParticipantDto, roomID);
  }

  @Get()
  findAll() {
    return this.roomService.findAll();
  }

  @Get(':roomID/participant')
  findAllParticipantsInRoom(@Param('roomID') roomID: string) {
    return this.roomService.findAllParticipants(roomID);
  }

  // @Get('participant')
  // findAllParticipants() {
  //   return this.participantService.findAll();
  // }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roomService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoomDto: UpdateRoomDto) {
    return this.roomService.update(+id, updateRoomDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roomService.remove(+id);
  }
}
