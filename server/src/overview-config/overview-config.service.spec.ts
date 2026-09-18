import { BadRequestException } from "@nestjs/common";
import { Repository } from "typeorm";
import {
  OverviewGraphType,
  OverviewGraphVariant,
  OverviewGroupBy,
  OverviewZoneInput,
} from "./dto/overview-config.dto";
import { DEFAULT_OVERVIEW_CONFIG } from "./overview-config.defaults";
import { OverviewConfig } from "./overview-config.model";
import { OverviewConfigService } from "./overview-config.service";

describe("OverviewConfigService", () => {
  let service: OverviewConfigService;
  let repository: {
    findOneBy: jest.Mock;
    save: jest.Mock;
  };

  const config: OverviewZoneInput[] = [
    {
      groupBy: OverviewGroupBy.Product,
      graphs: [{ type: OverviewGraphType.Totals, variant: OverviewGraphVariant.Pie }],
    },
  ];

  beforeEach(() => {
    repository = {
      findOneBy: jest.fn(),
      save: jest.fn(),
    };
    service = new OverviewConfigService(repository as unknown as Repository<OverviewConfig>);
  });

  it("returns the default config when no user override exists", async () => {
    repository.findOneBy.mockResolvedValue(null);

    await expect(service.findOneByEmployeeNumber(1)).resolves.toEqual(DEFAULT_OVERVIEW_CONFIG);
  });

  it("returns a user's stored config", async () => {
    repository.findOneBy.mockResolvedValue({ employeeNumber: 1, config });

    await expect(service.findOneByEmployeeNumber(1)).resolves.toEqual(config);
  });

  it("validates and saves a config override", async () => {
    repository.save.mockResolvedValue({ employeeNumber: 1, config });

    await expect(service.update(1, config)).resolves.toEqual(config);
    expect(repository.save).toHaveBeenCalledWith({ employeeNumber: 1, config });
  });

  it("rejects invalid config without saving it", async () => {
    const invalidConfig = [
      {
        ...config[0],
        graphs: [{ type: OverviewGraphType.Totals, variant: OverviewGraphVariant.Stacked }],
      },
    ];

    await expect(service.update(1, invalidConfig)).rejects.toBeInstanceOf(BadRequestException);
    expect(repository.save).not.toHaveBeenCalled();
  });
});
