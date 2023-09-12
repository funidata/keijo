import { ConsoleLogger, Injectable, LogLevel, Scope } from "@nestjs/common";
import { ConfigService } from "../config/config.service";

@Injectable({ scope: Scope.TRANSIENT })
export class Logger extends ConsoleLogger {
  constructor(private configService: ConfigService) {
    super("", { logLevels: ["debug"] });
  }

  log(message: unknown, context?: string): void {
    this.useConsoleLogger("log", message, context);
  }

  warn(message: unknown, context?: string): void {
    this.useConsoleLogger("warn", message, context);
  }

  error(message: unknown, context?: string): void {
    this.useConsoleLogger("error", message, context);
  }

  debug(message: unknown, context?: string): void {
    this.useConsoleLogger("debug", message, context);
  }

  private useConsoleLogger(loggerFn: LogLevel, message: unknown, context?: string): void {
    if (context === undefined) {
      super[loggerFn](message);
    } else {
      super[loggerFn](message, context);
    }
  }
}
