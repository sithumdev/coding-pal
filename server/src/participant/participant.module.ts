import { Module } from '@nestjs/common';
import { ParticipantService } from './participant.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Participant, ParticipantSchema } from './entities/participant.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Participant.name, schema: ParticipantSchema },
    ]),
  ],
  providers: [ParticipantService],
  exports: [ParticipantService],
})
export class ParticipantModule {}
