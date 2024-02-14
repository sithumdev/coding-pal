import { IsEnum, IsString, MaxLength } from 'class-validator';
import { ProgrammingLanguage } from '../types/languages';

export class CreateRoomDto {
  @IsString()
  @MaxLength(20)
  readonly name: string;

  @IsEnum(ProgrammingLanguage)
  readonly language: ProgrammingLanguage;

  @IsString()
  readonly owner: string;

  @IsString()
  readonly socketID: string;
}
