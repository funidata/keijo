import { Module } from "@nestjs/common";
import { NetvisorApiModule } from "../netvisor-api/netvisor-api.module";
import { DimensionResolver } from "./dimension.resolver";
import { DimensionService } from "./dimension.service";

@Module({
  imports: [NetvisorApiModule],
  providers: [DimensionService, DimensionResolver],
})
export class DimensionModule {}
