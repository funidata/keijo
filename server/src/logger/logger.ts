import { ConsoleLogger, Injectable, Scope } from "@nestjs/common";
import { ConfigService } from "../config/config.service";

@Injectable({ scope: Scope.TRANSIENT })
export class Logger extends ConsoleLogger {
  constructor(private configService: ConfigService) {
    super();
  }
}
