import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
  Logger,
} from "@nestjs/common";
import { GqlContextType, GqlExecutionContext } from "@nestjs/graphql";
import config from "../config/config";

// TODO: Move everything else to middleware (or validation pipes?) and leave only employee number fetching here.
// This is probably not the place to inject services etc.
// This should return undefined, if the header was not found(?).

export const EmployeeNumber = createParamDecorator((_, context: ExecutionContext) => {
  if (config.inDev) {
    return config.mockEmployeeNumber;
  }

  const logger = new Logger("EmployeeNumber");

  if (context.getType<GqlContextType>() !== "graphql") {
    const message = "Server only accepts GraphQL requests.";
    logger.error(message);
    throw new BadRequestException(message);
  }

  const employeeNumberHeaderKey = config.employeeNumberHeaderKey.toLowerCase();
  const request = GqlExecutionContext.create(context).getContext().req;
  const employeeNumberHeaderValue = request.headers[employeeNumberHeaderKey];

  return parseInt(employeeNumberHeaderValue);
});
