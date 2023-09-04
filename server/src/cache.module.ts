import { CacheModule } from "@nestjs/cache-manager";
import { Global, Module } from "@nestjs/common";
import { ConfigModule } from "./config/config.module";
import { ConfigService } from "./config/config.service";

@Global()
@Module({
  imports: [
    CacheModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        ttl: configService.config.netvisor.cacheTtl * 1000,
      }),
    }),
    ConfigModule,
  ],
  exports: [CacheModule],
})
export class CustomCacheModule {}
