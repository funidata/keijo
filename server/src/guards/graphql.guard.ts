import { BadRequestException, CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { AppLogger } from "../logger/app-logger";

@Injectable()
export class GraphQlGuard implements CanActivate {
  constructor(private logger: AppLogger) {
    logger.setContext(GraphQlGuard.name);
  }

  canActivate(context: ExecutionContext): boolean {
    if (context.getType().toString() !== "graphql") {
      this.logger.error("Received non-GraphQL request.");
      throw new BadRequestException("Server supports only GraphQL requests.");
    }
    return true;
  }
}
