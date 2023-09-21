import { ConsoleLogger, Injectable, LogLevel, Scope } from "@nestjs/common";
import { ConfigService } from "../config/config.service";

// TODO: Sanitize JSON output of extra fields.

/**
 * Nest.js-compatible custom logger.
 *
 * This class is designed to be injected into Nest app and other places that require
 * a logger with a ConsoleLogger-compatible interface. Instead of this, the `Logger`
 * class from this module should be used in code.
 */
@Injectable({ scope: Scope.TRANSIENT })
export class AppLogger extends ConsoleLogger {
  constructor(private configService: ConfigService) {
    super(AppLogger.name, { logLevels: [configService.config.logLevel] });
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

  // TODO: Refactor the rest into LoggerService.
  private useConsoleLogger(loggerFn: LogLevel, message: unknown, context?: string): void {
    if (this.configService.config.enableJsonLogs) {
      return;
    }

    super[loggerFn](this.getMessage(message), this.getContext(context));
  }

  private useJsonLogger(logLevel: LogLevel, message: unknown, contextOverride?: string): void {
    if (!this.configService.config.enableJsonLogs || !this.isLevelEnabled(logLevel)) {
      return;
    }

    this.logJsonString(logLevel, this.getMessage(message), contextOverride);
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
    return this.context || AppLogger.name;
  }

  private getMessage(content: unknown): string {
    if (typeof content === "string") {
      return content;
    }
    if (!content) {
      return "";
    }
    return content["data"];
  }
}
