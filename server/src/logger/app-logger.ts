import { ConsoleLogger, Injectable, LogLevel, Scope } from "@nestjs/common";
import dayjs from "dayjs";
import { ZodError } from "zod";
import { ConfigService } from "../config/config.service";
import {
  JsonAppLogOutputSchema,
  JsonAuditLogOutputSchema,
  jsonAppLogOutputSchema,
  jsonAuditLogOutputSchema,
} from "./interfaces/json-log-output.schema";

type ForbiddenFields = "logLevel" | "date" | "context";
export type AppLogContent = Omit<JsonAppLogOutputSchema, ForbiddenFields>;
export type AuditLogContent = Omit<JsonAuditLogOutputSchema, ForbiddenFields>;

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

  audit(content: AuditLogContent): void {
    if (!this.configService.config.enableAuditLogs) {
      return;
    }

    this.logJsonString("audit", content);
  }

  // TODO: Refactor the rest into LoggerService?
  private useConsoleLogger(loggerFn: LogLevel, message: unknown, context?: string): void {
    if (this.configService.config.enableJsonLogs) {
      return;
    }

    // Don't pass anything else except message string to ConsoleLogger to keep output clean.
    super[loggerFn](this.getMessage(message), this.getContext(context));
  }

  private useJsonLogger(logLevel: LogLevel, message: unknown, contextOverride?: string): void {
    if (!this.configService.config.enableJsonLogs || !this.isLevelEnabled(logLevel)) {
      return;
    }

    this.logJsonString(logLevel, this.getContent(message), contextOverride);
  }

  private logJsonString(
    logLevel: LogLevel | "audit",
    content: AppLogContent | AuditLogContent,
    contextOverride?: string,
  ): void {
    const context = this.getContext(contextOverride);
    const date = dayjs().toISOString();
    const unsafeOutput = { ...content, logLevel, date, context };

    try {
      const sanitizedOutput =
        logLevel === "audit"
          ? this.validateJsonAuditLogOutput(unsafeOutput as JsonAuditLogOutputSchema)
          : this.validateJsonAppLogOutput(unsafeOutput as JsonAppLogOutputSchema);
      const output = JSON.stringify(sanitizedOutput);
      console.log(output);
    } catch (error) {
      this.error("JSON log output validation failed with following errors:");
      const { issues } = error as ZodError;
      issues.forEach(({ message }) => {
        this.error(` - ${message}`, AppLogger.name);
      });
      this.error("All output for the invalid object is suppressed.");
    }
  }

  private getContext(context: unknown): string {
    // Nest may pass objects, so need to check that arg is strictly a string.
    if (typeof context === "string" && context.length > 0) {
      return context;
    }
    return this.context || AppLogger.name;
  }

  private getMessage(input: unknown): string {
    if (typeof input === "string") {
      return input;
    }
    if (!input) {
      return "";
    }
    return input["message"];
  }

  private getContent(input: unknown): AppLogContent | AuditLogContent {
    if (typeof input === "string") {
      return { message: input };
    }
    if (!input) {
      return { message: "" };
    }
    return input;
  }

  private validateJsonAppLogOutput(content: JsonAppLogOutputSchema): JsonAppLogOutputSchema {
    // ZobObject.parse will strip extra fields from input, including nested objects.
    return jsonAppLogOutputSchema.parse(content);
  }

  private validateJsonAuditLogOutput(content: JsonAuditLogOutputSchema): JsonAuditLogOutputSchema {
    // ZobObject.parse will strip extra fields from input, including nested objects.
    return jsonAuditLogOutputSchema.parse(content);
  }
}
