import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { CustomParamFactory } from "@nestjs/common/interfaces";
import { GqlExecutionContext } from "@nestjs/graphql";
import { get } from "lodash";

export const decoratorFactory: CustomParamFactory<object, string> = (
  _,
  context: ExecutionContext,
) => {
  const request = GqlExecutionContext.create(context).getContext().req;
  return get(request.headers, "x-shib-eppn", "");
};

export const Eppn = createParamDecorator(decoratorFactory);
