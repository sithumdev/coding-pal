import { IsString, MaxLength } from 'class-validator';

export class CreateParticipantDto {
  @IsString()
  @MaxLength(30)
  readonly name: string;

  @IsString()
  readonly github: string;

  @IsString()
  readonly socketID: string;
}
