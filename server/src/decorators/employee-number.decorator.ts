import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
  Logger,
} from "@nestjs/common";
import { GqlContextType, GqlExecutionContext } from "@nestjs/graphql";
import { string } from "zod";
import config from "../config/config";

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

  if (!Object.keys(request.headers).includes(employeeNumberHeaderKey)) {
    const message = `Header '${employeeNumberHeaderKey}' not found.`;
    logger.error(message);
    throw new BadRequestException(message);
  }

  const employeeNumberHeaderValue = request.headers[employeeNumberHeaderKey];

  try {
    string().regex(/^\d+$/).transform(Number).parse(employeeNumberHeaderValue);
  } catch {
    const message = `Header '${employeeNumberHeaderKey}' is not valid.`;
    logger.error(message);
    throw new BadRequestException(message);
  }

  return parseInt(employeeNumberHeaderValue);
});
