import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import config from "../config/config";

// FIXME: This should return undefined, if the header was not found(?).

export const EmployeeNumber = createParamDecorator((_, context: ExecutionContext) => {
  const employeeNumberHeaderKey = config.employeeNumberHeaderKey.toLowerCase();
  const request = GqlExecutionContext.create(context).getContext().req;
  const employeeNumberHeaderValue = request.headers[employeeNumberHeaderKey];

  return parseInt(employeeNumberHeaderValue);
});
