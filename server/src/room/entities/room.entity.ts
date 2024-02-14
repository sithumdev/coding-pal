import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { ObjectId } from 'mongoose';
import { ProgrammingLanguage } from '../types/languages';
import { Participant } from 'src/participant/entities/participant.entity';

export type RoomDocument = Room & Document;

@Schema({ timestamps: true, versionKey: false })
export class Room {
  _id: ObjectId;

  @Prop({ required: true, type: () => String, unique: true })
  roomID: string;

  @Prop({ required: true, type: () => String })
  name: string;

  @Prop({ enum: ProgrammingLanguage, default: ProgrammingLanguage.JAVASCRIPT })
  language: ProgrammingLanguage;

  @Prop({
    required: true,
    type: mongoose.Types.ObjectId,
    ref: Participant.name,
  })
  owner: Participant;

  @Prop({
    required: true,
    type: [{ type: mongoose.Types.ObjectId, ref: Participant.name }],
  })
  participants: Participant[];
}

export const RoomSchema = SchemaFactory.createForClass(Room);
