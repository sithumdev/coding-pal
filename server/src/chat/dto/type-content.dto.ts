import { IsString } from 'class-validator';

export class TypeContentDto {
  @IsString()
  readonly roomID: string;

  @IsString()
  readonly content: string;
}
