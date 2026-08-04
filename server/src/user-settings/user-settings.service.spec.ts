import { randomUUID } from "crypto";
import { Repository } from "typeorm";
import { EntryTemplateInput } from "./dto/entry-template.dto";
import { UserSettings } from "./user-settings.model";
import { UserSettingsService } from "./user-settings.service";

jest.mock("crypto", () => ({
  randomUUID: jest.fn(),
}));

describe("UserSettingsService", () => {
  let service: UserSettingsService;
  let repository: {
    findOneBy: jest.Mock;
    update: jest.Mock;
    save: jest.Mock;
    delete: jest.Mock;
  };

  beforeEach(() => {
    repository = {
      findOneBy: jest.fn(),
      update: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };

    service = new UserSettingsService(repository as unknown as Repository<UserSettings>);
  });

  it("adds entry templates with a generated UUID key", async () => {
    const entry: EntryTemplateInput = {
      duration: 60,
      description: "Daily review",
      product: null,
      activity: null,
      issue: null,
      client: null,
    };

    repository.findOneBy.mockResolvedValueOnce({ employeeNumber: 1, entryTemplates: [] });
    repository.findOneBy.mockResolvedValueOnce({
      employeeNumber: 1,
      entryTemplates: [{ key: "test-uuid", ...entry }],
    });
    (randomUUID as jest.Mock).mockReturnValue("test-uuid");

    const result = await service.addEntryTemplate(1, entry);

    expect(randomUUID).toHaveBeenCalledTimes(1);
    expect(result.entryTemplates).toEqual([{ key: "test-uuid", ...entry }]);
  });

  it("removes entry templates safely when none are present", async () => {
    repository.findOneBy.mockResolvedValueOnce({ employeeNumber: 1, entryTemplates: undefined });
    repository.findOneBy.mockResolvedValueOnce({ employeeNumber: 1, entryTemplates: [] });

    const result = await service.removeEntryTemplate(1, "missing-template");

    expect(repository.update).toHaveBeenCalledWith({ employeeNumber: 1 }, { entryTemplates: [] });
    expect(result.entryTemplates).toEqual([]);
  });
});
