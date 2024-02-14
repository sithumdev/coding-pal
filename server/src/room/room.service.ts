import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Room, RoomDocument } from './entities/room.entity';
import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { ParticipantService } from 'src/participant/participant.service';
import { Participant } from 'src/participant/entities/participant.entity';
import { CreateParticipantDto } from 'src/participant/dto/create-participant.dto';

@Injectable()
export class RoomService {
  constructor(
    @InjectModel(Room.name)
    private readonly roomRepo: Model<RoomDocument>,
    private readonly participantService: ParticipantService,
  ) {}

  async create(createRoomDto: CreateRoomDto): Promise<Room | HttpException> {
    let owner: any;

    try {
      const creatingOwner: CreateParticipantDto = {
        name: createRoomDto.owner,
      };

      owner = await this.participantService.create(creatingOwner);
    } catch (e) {
      return new HttpException('Owner creation failed', HttpStatus.BAD_REQUEST);
    }

    const newRoom = new this.roomRepo({
      ...createRoomDto,
      participants: [owner],
      roomID: uuidv4(),
      owner,
    });

    return await newRoom.save();
  }

  async addParticipant(
    createParticipantDto: CreateParticipantDto,
    roomID: string,
  ): Promise<Room | HttpException> {
    const createdParticipant =
      await this.participantService.create(createParticipantDto);

    if (!createdParticipant) {
      return new HttpException(
        'Joining participant failed',
        HttpStatus.BAD_REQUEST,
      );
    }

    const room = await this.roomRepo.findOne({ roomID });

    if (!room) {
      return new HttpException('Room not found', HttpStatus.NOT_FOUND);
    }

    room.participants.push(createdParticipant);

    return await room.save();
  }

  findAll() {
    return `This action returns all room`;
  }

  async findAllParticipants(roomID: string) {
    return await this.roomRepo
      .findOne({ roomID })
      .populate([
        'owner',
        { path: 'participants', model: Participant.name, select: 'name _id' },
      ])
      .exec();
  }

  async findOne(roomID: string) {
    const foundRoom = await this.roomRepo.findOne({ roomID }).exec();

    if (foundRoom) {
      return foundRoom;
    }

    throw new HttpException('Room not found', HttpStatus.NOT_FOUND);
  }

  update(id: number, updateRoomDto: UpdateRoomDto) {
    console.log(updateRoomDto);

    return `This action updates a #${id} room`;
  }

  remove(id: number) {
    return `This action removes a #${id} room`;
  }
}
