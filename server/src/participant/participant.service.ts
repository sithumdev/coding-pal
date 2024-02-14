import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateParticipantDto } from './dto/create-participant.dto';
import { UpdateParticipantDto } from './dto/update-participant.dto';
import { InjectModel } from '@nestjs/mongoose';
import {
  Participant,
  ParticipantDocument,
} from './entities/participant.entity';
import { Model } from 'mongoose';

@Injectable()
export class ParticipantService {
  constructor(
    @InjectModel(Participant.name)
    private readonly participantRepo: Model<ParticipantDocument>,
  ) {}

  async create(
    createParticipantDto: CreateParticipantDto,
  ): Promise<Participant> {
    const createdParticipant = new this.participantRepo({
      ...createParticipantDto,
    });

    return await createdParticipant.save();
  }

  async findAll(): Promise<Participant[]> {
    return await this.participantRepo.find().exec();
  }

  async findOne(id: string) {
    const foundParticipant = await this.participantRepo.findById(id).exec();

    if (foundParticipant) {
      return foundParticipant;
    }

    throw new HttpException('Participant not found', HttpStatus.NOT_FOUND);
  }

  update(id: number, updateParticipantDto: UpdateParticipantDto) {
    console.log(updateParticipantDto);

    return `This action updates a #${id} participant`;
  }

  remove(id: number) {
    return `This action removes a #${id} participant`;
  }
}
