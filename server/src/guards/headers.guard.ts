import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { Observable } from "rxjs";
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

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    console.log("canActivate called");
    const employeeNumberHeaderKey = this.configService.config.employeeNumberHeaderKey.toLowerCase();
    const request = GqlExecutionContext.create(context).getContext().req;

    if (!Object.keys(request.headers).includes(employeeNumberHeaderKey)) {
      const message = `Header '${employeeNumberHeaderKey}' not found.`;
      this.logger.error(message);
      throw new ForbiddenException(message);
    }

    const employeeNumberHeaderValue = request.headers[employeeNumberHeaderKey];

    try {
      string().regex(/^\d+$/).transform(Number).parse(employeeNumberHeaderValue);
    } catch {
      const message = `Header '${employeeNumberHeaderKey}' is not valid.`;
      this.logger.error(message);
      throw new ForbiddenException(message);
    }

    return true;
  }
}
