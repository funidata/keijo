import { createMock } from "@golevelup/ts-jest";
import { BadRequestException, ExecutionContext } from "@nestjs/common";
import { AppLogger } from "../logger/app-logger";
import { GraphQlGuard } from "./graphql.guard";

describe("GraphQlGuard", () => {
  let guard: GraphQlGuard;

  beforeEach(() => {
    const logger = createMock<AppLogger>();
    guard = new GraphQlGuard(logger);
  });

  it("Allows GraphQL requests", () => {
    const ctx = createMock<ExecutionContext>({ getType: () => "graphql" });
    expect(guard.canActivate(ctx)).toBeTruthy();
  });

  it("Denies activation with empty employee number header", () => {
    const ctx = createMock<ExecutionContext>({ getType: () => "http" });
    expect(() => guard.canActivate(ctx)).toThrowError(BadRequestException);
  });
});
