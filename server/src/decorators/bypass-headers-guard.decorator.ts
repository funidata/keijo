import { ExecutionContext, SetMetadata } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

const BYPASS_HEADERS_GUARD_METADATA_KEY = "bypass-headers-guard";

export const BypassHeadersGuard = () => SetMetadata(BYPASS_HEADERS_GUARD_METADATA_KEY, true);

export const getBypassHeadersGuardMetadataValue = (
  reflector: Reflector,
  context: ExecutionContext,
) => reflector.get<boolean | undefined>(BYPASS_HEADERS_GUARD_METADATA_KEY, context.getHandler());
