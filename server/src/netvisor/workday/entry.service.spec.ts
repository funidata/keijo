import { BadRequestException, NotFoundException } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import dayjs from "dayjs";
import {
  MockLogger,
  MockNetvisorApiService,
  MockWorkdayService,
} from "../../../test/utils/mock-services";
import { Logger } from "../../logger/logger";
import { NetvisorApiService } from "../netvisor-api/netvisor-api.service";
import { NetvisorEndpoints } from "../netvisor-api/netvisor-endpoints.enum";
import { Workday } from "./dto/workday.dto";
import { EntryService } from "./entry.service";
import { WorkdayService } from "./workday.service";

describe("EntryService", () => {
  const key = "100";
  const date = dayjs();
  const employeeNumber = 123;

  let service: EntryService;
  let workdayService: WorkdayService;
  let netvisorApiService: NetvisorApiService;
  let logger: Logger;
  let mockResolvedWorkday: (workdays: Workday[]) => void;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [EntryService, MockNetvisorApiService, MockWorkdayService, MockLogger],
    }).compile();

    service = module.get(EntryService);
    workdayService = module.get(WorkdayService);
    netvisorApiService = module.get(NetvisorApiService);
    logger = module.get(Logger);
    mockResolvedWorkday = (workdays: Workday[]) => {
      jest.spyOn(workdayService, "findMany").mockResolvedValueOnce(workdays);
    };
  });

  describe("findOne", () => {
    it("Returns the correct entry", () => {
      const entry = { key: "100", duration: 1, entryType: "", dimensions: [] };
      mockResolvedWorkday([
        {
          date: new Date(),
          entries: [{ key: "101", duration: 1, entryType: "", dimensions: [] }, entry],
        },
      ]);
      expect(service.findOne(key, date, employeeNumber)).resolves.toMatchObject(entry);
    });

    it("Returns undefined when workday does not exist", () => {
      mockResolvedWorkday([]);
      expect(service.findOne(key, date, employeeNumber)).resolves.toBeUndefined();
    });

    it("Returns undefined when entries do not exist", () => {
      mockResolvedWorkday([{ date: new Date(), entries: [] }]);
      expect(service.findOne(key, date, employeeNumber)).resolves.toBeUndefined();
    });

    it("Returns undefined when entry is not found", () => {
      mockResolvedWorkday([
        { date: new Date(), entries: [{ key: "101", duration: 1, entryType: "", dimensions: [] }] },
      ]);
      expect(service.findOne(key, date, employeeNumber)).resolves.toBeUndefined();
    });
  });

  describe("remove", () => {
    it("Removes the requested entry", async () => {
      const entry = { key, duration: 1, entryType: "", dimensions: [] };
      mockResolvedWorkday([
        {
          date: new Date(),
          entries: [entry],
        },
      ]);
      await service.remove(employeeNumber, "", key, date);

      expect(netvisorApiService.get).toBeCalledTimes(1);
      expect(netvisorApiService.get).toBeCalledWith(NetvisorEndpoints.DELETE_WORKDAYHOUR, [], {
        netvisorkey: key,
      });
      expect(logger.audit).toBeCalledTimes(1);
    });

    it("Throws on missing entry", async () => {
      mockResolvedWorkday([]);
      const res = service.remove(employeeNumber, "", key, date);
      await expect(res).rejects.toThrow(NotFoundException);
    });

    it("Throws on failed API operation", async () => {
      const entry = { key, duration: 1, entryType: "", dimensions: [] };
      mockResolvedWorkday([
        {
          date: new Date(),
          entries: [entry],
        },
      ]);
      jest
        .spyOn(netvisorApiService, "get")
        .mockResolvedValueOnce({ Root: { ResponseStatus: { Status: "FAILED" } } });
      const res = service.remove(employeeNumber, "", key, date);
      await expect(res).rejects.toThrow(BadRequestException);
    });
  });
});
