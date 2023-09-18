import { AuthenticationError } from "@nestjs/apollo";
import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { string } from "zod";
import { ConfigService } from "../config/config.service";
import { Logger } from "../logger/logger";

@Injectable()
export class HeadersGuard implements CanActivate {
  constructor(
    private logger: Logger,
    private configService: ConfigService,
  ) {
    logger.setContext(HeadersGuard.name);
  }

  canActivate(context: ExecutionContext): boolean {
    const employeeNumberHeaderKey = this.configService.config.employeeNumberHeaderKey.toLowerCase();
    const request = GqlExecutionContext.create(context).getContext().req;

    if (!Object.keys(request.headers).includes(employeeNumberHeaderKey)) {
      const message = `Header '${employeeNumberHeaderKey}' not found.`;
      this.logger.error(message);
      throw new AuthenticationError(message);
    }

    const employeeNumberHeaderValue = request.headers[employeeNumberHeaderKey];

    try {
      string().regex(/^\d+$/).transform(Number).parse(employeeNumberHeaderValue);
    } catch {
      const message = `Header '${employeeNumberHeaderKey}' is not valid.`;
      this.logger.error(message);
      throw new AuthenticationError(message);
    }

    return true;
  }
}
