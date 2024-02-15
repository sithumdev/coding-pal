import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongoose';

export type ParticipantDocument = Participant & Document;

@Schema({ timestamps: true, versionKey: false })
export class Participant {
  _id: ObjectId;

  @Prop({ required: true, type: () => String })
  name: string;

  @Prop({ required: true, type: () => String })
  github: string;

  @Prop({ required: true, type: () => String, unique: true })
  socketID: string;
}

export const ParticipantSchema = SchemaFactory.createForClass(Participant);
