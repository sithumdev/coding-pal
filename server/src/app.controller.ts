import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

export class ShareDto {
  roomID: string;
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('share')
  makeRoomShareable(@Body() shareDto: ShareDto): string {
    this.appService.shareRoom(shareDto);
    return 'Not Implemented';
  }
}
