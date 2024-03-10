import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateParticipantDto } from 'src/participant/dto/create-participant.dto';
import { Participant } from 'src/participant/entities/participant.entity';
import { ParticipantService } from 'src/participant/participant.service';
import { v4 as uuidv4 } from 'uuid';
import { CreateRoomDto } from './dto/create-room.dto';
import { Room, RoomDocument } from './entities/room.entity';
import { LeaveRoomDto } from 'src/chat/dto/leave-room.dto';

@Injectable()
export class RoomService {
  constructor(
    @InjectModel(Room.name)
    private readonly roomRepo: Model<RoomDocument>,
    private readonly participantService: ParticipantService,
  ) {}

  async create(createRoomDto: CreateRoomDto): Promise<Room | HttpException> {
    let owner: Participant;

    try {
      const creatingOwner: CreateParticipantDto = {
        name: createRoomDto.owner,
        socketID: createRoomDto.socketID,
        github: createRoomDto.github,
      };

      owner = await this.participantService.create(creatingOwner);
    } catch (e) {
      return new HttpException('Owner creation failed', HttpStatus.BAD_REQUEST);
    }

    const newRoom = new this.roomRepo({
      ...createRoomDto,
      participants: [],
      roomID: uuidv4(),
      owner: owner.socketID,
      codeSnippet: '// your code here',
    });

    return await newRoom.save();
  }

  async updateCodeSnippet(roomID: string, codeSnippet: string) {
    return this.roomRepo.findOneAndUpdate({roomID}, {codeSnippet}, {upsert: true, new: true});
  }

  async addParticipant(
    createParticipantDto: CreateParticipantDto,
    roomID: string,
  ): Promise<Room | HttpException> {
    const room = await this.roomRepo.findOne({ roomID });

    if (!room) {
      return new HttpException('Room not found', HttpStatus.NOT_FOUND);
    }

    if (room.owner === createParticipantDto.socketID) {
      // Owner has joined

      const owner = await this.participantService.findOne(
        createParticipantDto.socketID,
      );

      room.participants.push(owner);

      return await room.save();
    } else {
      const createdParticipant =
        await this.participantService.create(createParticipantDto);

      if (!createdParticipant) {
        return new HttpException(
          'Joining participant failed',
          HttpStatus.BAD_REQUEST,
        );
      }

      room.participants.push(createdParticipant);

      return room.save();
    }
  }

  async handleDisconnectParticipant(socketID: string): Promise<void> {
    const deletedParticipant = await this.participantService.remove(socketID);

    if (deletedParticipant) {
      const ownedRooms: Room[] = await this.roomRepo.find({ owner: socketID });

      await Promise.all(
        ownedRooms.map(async (room) => {
          const foundRoom = await this.roomRepo.findById(room._id);

          foundRoom.participants = foundRoom.participants.filter(
            (participant) => participant.socketID !== socketID,
          );

          const updatedRoom = await foundRoom.save();

          if (updatedRoom.participants.length === 0) {
            await this.roomRepo.findByIdAndDelete(updatedRoom.id);
          } else {
            updatedRoom.owner = updatedRoom.participants[0].socketID;

            await updatedRoom.save();
          }
        }),
      );
    }
  }

  async handleLeave(socketID: string, leaveRoomDto: LeaveRoomDto) {
    const deletedParticipant = await this.participantService.remove(socketID);

    if (deletedParticipant) {
      const foundRoom = await this.roomRepo.findOne({
        roomID: leaveRoomDto.roomID,
      });

      if (foundRoom) {
        foundRoom.participants = foundRoom.participants.filter(
          (participant) => participant.socketID !== socketID,
        );

        const updatedRoom = await foundRoom.save();

        if (foundRoom.owner === socketID) {
          if (updatedRoom.participants.length === 0) {
            await this.roomRepo.findByIdAndDelete(updatedRoom.id);
          } else {
            updatedRoom.owner = updatedRoom.participants[0].socketID;

            await updatedRoom.save();
          }
        }
      }
    }

    return deletedParticipant;
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
    const foundRoom = await this.roomRepo
      .findOne({ roomID })
      .populate('participants')
      .exec();

    if (foundRoom) {
      return foundRoom;
    }

    throw new HttpException('Room not found', HttpStatus.NOT_FOUND);
  }
}
