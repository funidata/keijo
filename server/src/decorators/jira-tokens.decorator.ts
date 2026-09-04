import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { CustomParamFactory } from "@nestjs/common/interfaces";
import { GqlExecutionContext } from "@nestjs/graphql";
import { JiraTokens } from "../jira/jira.types";

export const decoratorFactory: CustomParamFactory<object, JiraTokens | undefined> = (
  _,
  context: ExecutionContext,
) => {
  const request = GqlExecutionContext.create(context).getContext().req;
  return request.session?.user;
};

export const JiraTokensFromSession = createParamDecorator(decoratorFactory);
