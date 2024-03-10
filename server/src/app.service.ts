import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ShareDto } from './app.controller';
import { Subject } from 'rxjs';

@Injectable()
export class AppService implements OnModuleDestroy {
  private shutDownListeners$: Subject<void> = new Subject();
  private readonly logger = new Logger(AppService.name);

  onModuleDestroy(): any {
    this.logger.warn('Gracefully shutting down the server');
    // console.log('Crashed');
  }

  public subscribeToShutDown(shutDownFn: () => void) {
    this.shutDownListeners$.subscribe(() => shutDownFn());
  }

  shutdown() {
    this.shutDownListeners$.next();
  }

  getHello(): string {
    return 'Hello World!';
  }

  shareRoom(shareDto: ShareDto): void {
    console.log(shareDto);
    this.shutdown();

    // TODO: Implement in next major version
    // throw new Error(`Method unimplemented ${shareDto}`);
    // process.kill(process.pid, 'SIGTERM');
    // process.exit(0);
    // return shareDto.roomID;
  }
}
