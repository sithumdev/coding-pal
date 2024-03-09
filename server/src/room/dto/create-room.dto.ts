import {IsEnum, IsOptional, IsString, MaxLength} from 'class-validator';
import { ProgrammingLanguage } from '../types/languages';

export class CreateRoomDto {
  @IsString()
  @MaxLength(20)
  readonly name: string;

  @IsString()
  @IsOptional()
  readonly codeSnippet: string;

  @IsString()
  readonly github: string;

  @IsEnum(ProgrammingLanguage)
  readonly language: ProgrammingLanguage;

  @IsString()
  readonly owner: string;

  @IsString()
  readonly socketID: string;
}
