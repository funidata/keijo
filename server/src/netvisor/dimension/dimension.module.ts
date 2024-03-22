import { Module } from "@nestjs/common";
import { NetvisorApiModule } from "../netvisor-api/netvisor-api.module";
import { DimensionCacheService } from "./dimension-cache.service";
import { DimensionConstraint } from "./dimension.constraint";
import { DimensionResolver } from "./dimension.resolver";
import { DimensionService } from "./dimension.service";

@Module({
  imports: [NetvisorApiModule],
  providers: [DimensionService, DimensionCacheService, DimensionResolver, DimensionConstraint],
})
export class DimensionModule {}
