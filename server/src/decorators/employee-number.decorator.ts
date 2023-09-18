import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { CustomParamFactory } from "@nestjs/common/interfaces";
import { GqlExecutionContext } from "@nestjs/graphql";

export const decoratorFactory: CustomParamFactory<object, ExecutionContext, number> = (
  _,
  context: ExecutionContext,
) => {
  const request = GqlExecutionContext.create(context).getContext().req;
  return request.employeeNumber;
};

export const EmployeeNumber = createParamDecorator(decoratorFactory);
