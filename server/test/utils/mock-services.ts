import { PartialFuncReturn, createMock } from "@golevelup/ts-jest";
import { FactoryProvider, InjectionToken } from "@nestjs/common";
import { Logger } from "../../src/logger/logger";
import { NetvisorApiService } from "../../src/netvisor/netvisor-api/netvisor-api.service";
import { WorkdayService } from "../../src/netvisor/workday/workday.service";

const createMockProvider = <T extends object>(
  service: InjectionToken,
  partial?: PartialFuncReturn<T>,
): FactoryProvider<T> => ({
  provide: service,
  useFactory: () => createMock<T>(partial),
});

export const MockNetvisorApiService = createMockProvider(NetvisorApiService);

export const MockWorkdayService = createMockProvider(WorkdayService);

export const MockLogger = createMockProvider(Logger);
