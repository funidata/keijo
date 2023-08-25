import { BadRequestException, createParamDecorator, ExecutionContext } from "@nestjs/common";
import { GqlContextType, GqlExecutionContext } from "@nestjs/graphql";
import { string } from "zod";
import config from "../config/config";

export const EmployeeNumber = createParamDecorator((_, context: ExecutionContext) => {
  if (context.getType<GqlContextType>() !== "graphql") {
    throw new BadRequestException("Server only accepts GraphQL requests.");
  }

  const employeeNumberHeaderKey = config.employeeNumberHeaderKey.toLowerCase();

  const request = GqlExecutionContext.create(context).getContext().req;

  if (!Object.keys(request.headers).includes(employeeNumberHeaderKey)) {
    throw new BadRequestException(`Header '${employeeNumberHeaderKey}' not found.`);
  }

  const employeeNumberHeaderValue = request.headers[employeeNumberHeaderKey];

  try {
    string().regex(/^\d+$/).transform(Number).parse(employeeNumberHeaderValue);
  } catch {
    throw new BadRequestException(`Header '${employeeNumberHeaderKey}' is not valid.`);
  }

  return parseInt(employeeNumberHeaderValue);
});
