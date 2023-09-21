import { createMock } from "@golevelup/ts-jest";
import { AuthenticationError } from "@nestjs/apollo";
import { Reflector } from "@nestjs/core";
import { Test } from "@nestjs/testing";
import mockConfigProvider, { defaultMockConfig } from "../../test/utils/mock-config.service";
import { mockContextWithHeaders } from "../../test/utils/mock-context";
import { ConfigService } from "../config/config.service";
import { AppLogger } from "../logger/app-logger";
import { HeadersGuard } from "./headers.guard";

describe("HeadersGuard", () => {
  let guard: HeadersGuard;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [mockConfigProvider()],
    }).compile();
    const logger = createMock<AppLogger>();
    const configService = module.get(ConfigService);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const reflector = createMock<Reflector>({ get: (): any => undefined });
    guard = new HeadersGuard(logger, configService, reflector);
  });

  it("Allows activation with valid headers", () => {
    const ctx = mockContextWithHeaders({ [defaultMockConfig.employeeNumberHeaderKey]: "123" });
    expect(guard.canActivate(ctx)).toBeTruthy();
  });

  it("Denies activation with empty employee number header", () => {
    const ctx = mockContextWithHeaders({ [defaultMockConfig.employeeNumberHeaderKey]: "" });
    expect(() => guard.canActivate(ctx)).toThrowError(AuthenticationError);
  });

  it("Denies activation with undefined employee number header", () => {
    const ctx = mockContextWithHeaders({ [defaultMockConfig.employeeNumberHeaderKey]: undefined });
    expect(() => guard.canActivate(ctx)).toThrowError(AuthenticationError);
  });

  it("Denies activation with missing employee number header", () => {
    const ctx = mockContextWithHeaders({});
    expect(() => guard.canActivate(ctx)).toThrowError(AuthenticationError);
  });

  it("Denies activation with an invalid employee number header", () => {
    const ctx = mockContextWithHeaders({ [defaultMockConfig.employeeNumberHeaderKey]: "123a" });
    expect(() => guard.canActivate(ctx)).toThrowError(AuthenticationError);
  });

  describe("With bypass on", () => {
    beforeEach(async () => {
      const module = await Test.createTestingModule({
        providers: [mockConfigProvider()],
      }).compile();
      const logger = createMock<AppLogger>();
      const configService = module.get(ConfigService);
      const reflector = createMock<Reflector>({ get: () => true });
      guard = new HeadersGuard(logger, configService, reflector);
    });

    it("Allows activation with valid headers", () => {
      const ctx = mockContextWithHeaders({ [defaultMockConfig.employeeNumberHeaderKey]: "123" });
      expect(guard.canActivate(ctx)).toBeTruthy();
    });

    it("Allows activation with undefined employee number header", () => {
      const ctx = mockContextWithHeaders({
        [defaultMockConfig.employeeNumberHeaderKey]: undefined,
      });
      expect(guard.canActivate(ctx)).toBeTruthy();
    });

    it("Allows activation with an invalid employee number header", () => {
      const ctx = mockContextWithHeaders({ [defaultMockConfig.employeeNumberHeaderKey]: "123a" });
      expect(guard.canActivate(ctx)).toBeTruthy();
    });
  });
});
