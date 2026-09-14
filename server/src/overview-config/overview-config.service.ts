import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { type OverviewZoneInput } from "./dto/overview-config.dto";
import { DEFAULT_OVERVIEW_CONFIG } from "./overview-config.defaults";
import { OverviewConfig } from "./overview-config.model";
import { overviewConfigSchema } from "./overview-config.validation";

@Injectable()
export class OverviewConfigService {
  constructor(
    @InjectRepository(OverviewConfig) private overviewConfigs: Repository<OverviewConfig>,
  ) {}

  async findOneByEmployeeNumber(employeeNumber: number) {
    const overviewConfig = await this.overviewConfigs.findOneBy({ employeeNumber });

    return overviewConfig?.config ?? DEFAULT_OVERVIEW_CONFIG;
  }

  async update(employeeNumber: number, config: OverviewZoneInput[]) {
    const parsedConfig = overviewConfigSchema.safeParse(config);

    if (!parsedConfig.success) {
      throw new BadRequestException("Invalid overview configuration.");
    }

    const overviewConfig = await this.overviewConfigs.save({
      employeeNumber,
      config: parsedConfig.data,
    });

    return overviewConfig.config;
  }
}
