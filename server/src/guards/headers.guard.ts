import { AuthenticationError } from "@nestjs/apollo";
import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { GqlExecutionContext } from "@nestjs/graphql";
import { string } from "zod";
import { ConfigService } from "../config/config.service";
import { getBypassHeadersGuardMetadataValue } from "../decorators/bypass-headers-guard.decorator";
import { Logger } from "../logger/logger";

@Injectable()
export class HeadersGuard implements CanActivate {
  private employeeNumberHeaderKey: string;

  constructor(
    private logger: Logger,
    configService: ConfigService,
    private readonly reflector: Reflector,
  ) {
    logger.setContext(HeadersGuard.name);
    this.employeeNumberHeaderKey = configService.config.employeeNumberHeaderKey.toLowerCase();
  }

  canActivate(context: ExecutionContext): boolean {
    // Guard can be bypassed using @BypassHeadersGuard decorator.
    const bypass = getBypassHeadersGuardMetadataValue(this.reflector, context);
    if (bypass) {
      this.appendEmployeeNumberToRequest(context);
      return true;
    }

    const request = GqlExecutionContext.create(context).getContext().req;

    if (!Object.keys(request.headers).includes(this.employeeNumberHeaderKey)) {
      const message = `Header '${this.employeeNumberHeaderKey}' not found.`;
      this.logger.error(message);
      throw new AuthenticationError(message);
    }

    const employeeNumberHeaderValue = request.headers[this.employeeNumberHeaderKey];

    try {
      string().regex(/^\d+$/).transform(Number).parse(employeeNumberHeaderValue);
    } catch {
      const message = `Header '${this.employeeNumberHeaderKey}' is not valid.`;
      this.logger.error(message);
      throw new AuthenticationError(message);
    }

    this.appendEmployeeNumberToRequest(context);

    return true;
  }

  private appendEmployeeNumberToRequest(context: ExecutionContext): void {
    const request = GqlExecutionContext.create(context).getContext().req;
    const employeeNumberHeaderValue = request.headers[this.employeeNumberHeaderKey];
    request.employeeNumber = parseInt(employeeNumberHeaderValue) || undefined;
  }
}
