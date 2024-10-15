import { ConsoleLogger, Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService extends ConsoleLogger {
  constructor() {
    super();
  }
  override error(message: string | Error): void {
    if (typeof message === 'string') {
      super.error(message);
    } else {
      super.error(message, message.stack);
    }
  }
}
