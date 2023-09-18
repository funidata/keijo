import { createMock } from "@golevelup/ts-jest";
import { ExecutionContext } from "@nestjs/common";

export const mockContextWithRequest = (req: object): ExecutionContext => {
  const args = [{}, {}, { req }, {}];
  const context = createMock<ExecutionContext>({
    getArgs: () => args,
    getType: () => "graphql",
  });
  return context;
};

export const mockContextWithHeaders = (headers: object): ExecutionContext =>
  mockContextWithRequest({ headers });
