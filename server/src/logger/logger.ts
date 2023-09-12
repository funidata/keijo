import { ConsoleLogger, Injectable, LogLevel, Scope } from "@nestjs/common";
import { ConfigService } from "../config/config.service";

@Injectable({ scope: Scope.TRANSIENT })
export class Logger extends ConsoleLogger {
  constructor(private configService: ConfigService) {
    super(Logger.name, { logLevels: [configService.config.logLevel] });
  }

  log(message: unknown, context?: string): void {
    this.useConsoleLogger("log", message, context);
    this.useJsonLogger("log", message, context);
  }

  warn(message: unknown, context?: string): void {
    this.useConsoleLogger("warn", message, context);
    this.useJsonLogger("warn", message, context);
  }

  error(message: unknown, context?: string): void {
    this.useConsoleLogger("error", message, context);
    this.useJsonLogger("error", message, context);
  }

  debug(message: unknown, context?: string): void {
    this.useConsoleLogger("debug", message, context);
    this.useJsonLogger("debug", message, context);
  }

  private useConsoleLogger(loggerFn: LogLevel, message: unknown, context?: string): void {
    if (this.configService.config.enableJsonLogs) {
      return;
    }

    if (context === undefined) {
      super[loggerFn](message);
    } else {
      super[loggerFn](message, context);
    }
  }

  private useJsonLogger(logLevel: LogLevel, message: unknown, contextOverride?: string): void {
    if (!this.configService.config.enableJsonLogs || !this.isLevelEnabled(logLevel)) {
      return;
    }

    const context = contextOverride || this.context;

    const output = JSON.stringify({ logLevel, context, message });
    console.log(output);
  }
}
