import { BadRequestException, ForbiddenException, NotFoundException } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import dayjs from "dayjs";
import {
  MockLogger,
  MockNetvisorApiService,
  MockWorkdayService,
} from "../../../test/utils/mock-services";
import config from "../../config/config";
import { Logger } from "../../logger/logger";
import { NetvisorApiService } from "../netvisor-api/netvisor-api.service";
import { NetvisorEndpoints } from "../netvisor-api/netvisor-endpoints.enum";
import { Entry } from "./dto/entry.dto";
import { Workday } from "./dto/workday.dto";
import { EntryService } from "./entry.service";
import { AcceptanceStatus } from "./enum/acceptance-status.enum";
import { WorkdayService } from "./workday.service";

const key = "100";
const date = dayjs();
const employeeNumber = 123;

const entry: Entry = {
  key,
  duration: 1,
  durationInHours: true,
  description: "jee",
  acceptanceStatus: AcceptanceStatus.Checked,
  typeName: "tuntityö",
  ratioNumber: 100,
  product: "testituote",
  activity: "testitunkkaus",
  issue: "TIKSU-007",
  client: "maksaja",
};

describe("EntryService", () => {
  let entryService: EntryService;
  let workdayService: WorkdayService;
  let netvisorApiService: NetvisorApiService;
  let logger: Logger;
  let mockResolvedWorkday: (workdays: Workday[]) => void;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [EntryService, MockNetvisorApiService, MockWorkdayService, MockLogger],
    }).compile();

    entryService = module.get(EntryService);
    workdayService = module.get(WorkdayService);
    netvisorApiService = module.get(NetvisorApiService);
    logger = module.get(Logger);
    mockResolvedWorkday = (workdays: Workday[]) => {
      jest.spyOn(workdayService, "findMany").mockResolvedValueOnce(workdays);
    };
  });

  describe("findOne", () => {
    it("Returns the correct entry", () => {
      mockResolvedWorkday([
        {
          date: new Date(),
          entries: [{ ...entry, key: "101" }, entry],
        },
      ]);
      expect(entryService.findOne(key, date, employeeNumber)).resolves.toMatchObject(entry);
    });

    it("Returns undefined when workday does not exist", () => {
      mockResolvedWorkday([]);
      expect(entryService.findOne(key, date, employeeNumber)).resolves.toBeUndefined();
    });

    it("Returns undefined when entries do not exist", () => {
      mockResolvedWorkday([{ date: new Date(), entries: [] }]);
      expect(entryService.findOne(key, date, employeeNumber)).resolves.toBeUndefined();
    });

    it("Returns undefined when entry is not found", () => {
      mockResolvedWorkday([{ date: new Date(), entries: [{ ...entry, key: "101" }] }]);
      expect(entryService.findOne(key, date, employeeNumber)).resolves.toBeUndefined();
    });
  });

  describe("remove", () => {
    it("Removes the requested entry", async () => {
      mockResolvedWorkday([
        {
          date: new Date(),
          entries: [entry],
        },
      ]);
      await entryService.remove(employeeNumber, "", key, date);

      expect(netvisorApiService.get).toBeCalledTimes(1);
      expect(netvisorApiService.get).toBeCalledWith(NetvisorEndpoints.DELETE_WORKDAYHOUR, [], {
        netvisorkey: key,
      });
      expect(logger.audit).toBeCalledTimes(1);
    });

    it("Denies removing an accepted entry", async () => {
      mockResolvedWorkday([
        {
          date: new Date(),
          entries: [{ ...entry, acceptanceStatus: AcceptanceStatus.Accepted }],
        },
      ]);

      const test = entryService.remove(employeeNumber, "", key, date);
      await expect(test).rejects.toThrow(ForbiddenException);
    });

    it("Throws on missing entry", async () => {
      mockResolvedWorkday([]);
      const res = entryService.remove(employeeNumber, "", key, date);
      await expect(res).rejects.toThrow(NotFoundException);
    });

    it("Throws on failed API operation", async () => {
      mockResolvedWorkday([
        {
          date: new Date(),
          entries: [entry],
        },
      ]);
      jest
        .spyOn(netvisorApiService, "get")
        .mockResolvedValueOnce({ Root: { ResponseStatus: { Status: "FAILED" } } });
      const res = entryService.remove(employeeNumber, "", key, date);
      await expect(res).rejects.toThrow(BadRequestException);
    });
  });

  describe("addWorkdayEntry", () => {
    it("Adds entry", async () => {
      const call = entryService.addWorkdayEntry(employeeNumber, "", {
        ...entry,
        date: date.toDate(),
      });
      await expect(call).resolves.toBeUndefined();
      expect(netvisorApiService.post).toBeCalledTimes(1);
      expect(netvisorApiService.post).toBeCalledWith(NetvisorEndpoints.POST_WORKDAY, {
        root: {
          workday: {
            date: {
              "#text": date.format("YYYY-MM-DD"),
              "@_method": "increment",
            },
            employeeidentifier: {
              "#text": employeeNumber,
              "@_type": "number",
            },
            workdayhour: {
              acceptancestatus: "confirmed",
              collectorratio: {
                "#text": config.netvisor.ratioNumber,
                "@_type": "number",
              },
              description: entry.description,
              dimension: [
                {
                  dimensionitem: entry.product,
                  dimensionname: "1 Tuote",
                },
                {
                  dimensionitem: entry.activity,
                  dimensionname: "2 Toiminto",
                },
                {
                  dimensionitem: entry.issue,
                  dimensionname: "3 Tiketti",
                },
                {
                  dimensionitem: entry.client,
                  dimensionname: "4 Asiakas",
                },
              ],
              hours: entry.duration,
            },
          },
        },
      });
      expect(logger.audit).toBeCalledTimes(1);
    });

    describe("replace", () => {
      it("Removes the old entry and creates a new one", async () => {
        const replacement = {
          ...entry,
          date: date.subtract(2).toDate(),
          duration: 2,
        };

        mockResolvedWorkday([
          {
            date: date.toDate(),
            entries: [entry],
          },
        ]);

        jest.spyOn(entryService, "remove");
        jest.spyOn(entryService, "addWorkdayEntry");
        const call = entryService.replace(employeeNumber, "", key, date, replacement);

        await expect(call).resolves.toBeUndefined();
        expect(entryService.remove).toBeCalledTimes(1);
        expect(entryService.remove).toBeCalledWith(employeeNumber, "", key, date);
        expect(entryService.addWorkdayEntry).toBeCalledTimes(1);
        expect(entryService.addWorkdayEntry).toBeCalledWith(employeeNumber, "", replacement);
      });
    });
  });
});
