import { APP_GUARD } from "@nestjs/core";
import { HeadersGuard } from "./headers.guard";

/**
 * Global guards.
 *
 * These do not affect `ServeStaticModule` when injected in `AppModule` providers,
 * which is what we want.
 */
export const appGuards = [
  {
    provide: APP_GUARD,
    useClass: HeadersGuard,
  },
];
