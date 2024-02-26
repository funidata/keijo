import { Injectable, Scope } from "@nestjs/common";
import { AppLogContent, AppLogger, AuditLogContent } from "./app-logger";

// TODO: Use this class in code instead of AppLogger.

@Injectable({ scope: Scope.TRANSIENT })
export class Logger {
  private context: string | undefined;

  constructor(private appLogger: AppLogger) {
    appLogger.setContext(Logger.name);
  }

  setContext(context: string): void {
    this.context = context;
    this.appLogger.setContext(context);
  }

  error(content: string | AppLogContent): void {
    this.assertContext();
    this.appLogger.error(content);
  }

  warn(content: string | AppLogContent): void {
    this.assertContext();
    this.appLogger.warn(content);
  }

  log(content: string | AppLogContent): void {
    this.assertContext();
    this.appLogger.log(content);
  }

  debug(content: unknown): void {
    this.assertContext();
    this.appLogger.debug(content);
  }

  audit(content: AuditLogContent): void {
    this.assertContext();
    this.appLogger.audit(content);
  }

  private assertContext(): void {
    if (this.context === undefined) {
      this.appLogger.warn(
        "Logger context was not set before calling logging methods. Use Logger.setContext to pass the relevant context name to Logger.",
      );
    }
  }
}
