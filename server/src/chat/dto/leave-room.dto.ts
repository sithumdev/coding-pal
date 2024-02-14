import { IsString } from 'class-validator';

export class LeaveRoomDto {
  @IsString()
  readonly roomID: string;
}
