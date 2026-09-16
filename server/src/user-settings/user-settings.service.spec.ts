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
      templateName: "Daily Review template",
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

  it("removes a template identified by a UUID-like key", async () => {
    repository.findOneBy.mockResolvedValueOnce({
      employeeNumber: 1,
      entryTemplates: [{ key: "123e4567-e89b-12d3-a456-426614174000" }],
    });
    repository.findOneBy.mockResolvedValueOnce({ employeeNumber: 1, entryTemplates: [] });

    await service.removeEntryTemplate(1, "123e4567-e89b-12d3-a456-426614174000");

    expect(repository.update).toHaveBeenCalledWith({ employeeNumber: 1 }, { entryTemplates: [] });
  });

  it("replaces a template identified by key with updated values", async () => {
    const original = {
      key: "template-key",
      templateName: "Old name",
      duration: 60,
      description: "Old description",
      product: null,
      activity: null,
      issue: null,
      client: null,
    };
    const update: EntryTemplateInput = {
      templateName: "New name",
      duration: 120,
      description: "New description",
      product: "TestProduct",
      activity: null,
      issue: null,
      client: null,
    };

    repository.findOneBy.mockResolvedValueOnce({ employeeNumber: 1, entryTemplates: [original] });
    repository.findOneBy.mockResolvedValueOnce({
      employeeNumber: 1,
      entryTemplates: [{ key: "template-key", ...update }],
    });

    const result = await service.replaceEntryTemplate(1, "template-key", update);

    expect(repository.update).toHaveBeenCalledWith(
      { employeeNumber: 1 },
      { entryTemplates: [{ key: "template-key", ...update }] },
    );
    expect(result.entryTemplates).toEqual([{ key: "template-key", ...update }]);
  });

  it("leaves other templates unchanged when replacing one", async () => {
    const target = { key: "target-key", templateName: "Target", duration: 60, description: "", product: null, activity: null, issue: null, client: null };
    const other = { key: "other-key", templateName: "Other", duration: 30, description: "", product: null, activity: null, issue: null, client: null };
    const update: EntryTemplateInput = { templateName: "Updated", duration: 90, description: "", product: null, activity: null, issue: null, client: null };

    repository.findOneBy.mockResolvedValueOnce({ employeeNumber: 1, entryTemplates: [target, other] });
    repository.findOneBy.mockResolvedValueOnce({
      employeeNumber: 1,
      entryTemplates: [{ key: "target-key", ...update }, other],
    });

    await service.replaceEntryTemplate(1, "target-key", update);

    expect(repository.update).toHaveBeenCalledWith(
      { employeeNumber: 1 },
      { entryTemplates: [{ key: "target-key", ...update }, other] },
    );
  });

  it("does not crash when replacing a non-existent template", async () => {
    const update: EntryTemplateInput = { templateName: "New", duration: 60, description: "", product: null, activity: null, issue: null, client: null };

    repository.findOneBy.mockResolvedValueOnce({ employeeNumber: 1, entryTemplates: undefined });
    repository.findOneBy.mockResolvedValueOnce({ employeeNumber: 1, entryTemplates: [] });

    const result = await service.replaceEntryTemplate(1, "missing-key", update);

    expect(repository.update).toHaveBeenCalledWith({ employeeNumber: 1 }, { entryTemplates: [] });
    expect(result.entryTemplates).toEqual([]);
  });
});
