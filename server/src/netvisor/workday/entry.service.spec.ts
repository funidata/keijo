import { Test } from "@nestjs/testing";
import dayjs from "dayjs";
import {
  MockLogger,
  MockNetvisorApiService,
  MockWorkdayService,
} from "../../../test/utils/mock-services";
import { Workday } from "./dto/workday.dto";
import { EntryService } from "./entry.service";
import { WorkdayService } from "./workday.service";

describe("Entry service", () => {
  const key = "100";
  const date = dayjs();
  const employeeNumber = 123;

  let service: EntryService;
  let workdayService: WorkdayService;
  let mockResolvedWorkday: (workdays: Workday[]) => void;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [EntryService, MockNetvisorApiService, MockWorkdayService, MockLogger],
    }).compile();

    service = module.get(EntryService);
    workdayService = module.get(WorkdayService);
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
});
