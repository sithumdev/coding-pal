import { Injectable } from '@nestjs/common';
import { ShareDto } from './app.controller';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  shareRoom(shareDto: ShareDto): string {
    // TODO: Implement in next major version
    throw new Error(`Method unimplemented ${shareDto}`);
    // process.kill(process.pid, 'SIGTERM');
    // process.exit(0);
    return shareDto.roomID;
  }
}
