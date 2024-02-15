import { IsString } from 'class-validator';

export class JoinRoomDto {
  @IsString()
  readonly name: string;

  @IsString()
  readonly github: string;

  @IsString()
  readonly roomID: string;
}
