import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Inject, Injectable } from "@nestjs/common";
import { Cache } from "cache-manager";
import { NetvisorApiService } from "../netvisor-api/netvisor-api.service";
import { NetvisorEndpoints } from "../netvisor-api/netvisor-endpoints.enum";

const CACHE_KEY = "recordTypes";

@Injectable()
export class RecordTypeCacheService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private netvisorApiService: NetvisorApiService,
  ) {}

  async getCachedRecordTypeData() {
    const existing = await this.cacheManager.get(CACHE_KEY);

    if (existing) {
      return existing;
    }

    const data = await this.netvisorApiService.get(NetvisorEndpoints.GET_RECORD_TYPES);
    await this.cacheManager.set(CACHE_KEY, data);
    return data;
  }
}
