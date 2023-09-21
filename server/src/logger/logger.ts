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

  audit(message: unknown): void {
    if (!this.configService.config.enableAuditLogs) {
      return;
    }

    this.logJsonString("audit", message);
  }

  private useConsoleLogger(loggerFn: LogLevel, message: unknown, context?: string): void {
    if (this.configService.config.enableJsonLogs) {
      return;
    }

    super[loggerFn](message, this.getContext(context));
  }

  private useJsonLogger(logLevel: LogLevel, message: unknown, contextOverride?: string): void {
    if (!this.configService.config.enableJsonLogs || !this.isLevelEnabled(logLevel)) {
      return;
    }

    this.logJsonString(logLevel, message, contextOverride);
  }

  private logJsonString(
    logLevel: LogLevel | "audit",
    message: unknown,
    contextOverride?: string,
  ): void {
    const context = this.getContext(contextOverride);

    const output = JSON.stringify({ logLevel, context, message });
    console.log(output);
  }

  private getContext(context: unknown): string {
    // Nest may pass objects, so need to check that arg is strictly a string.
    if (typeof context === "string" && context.length > 0) {
      return context;
    }
    return this.context || Logger.name;
  }
}
