import { Injectable, Logger } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";

@Injectable()
export class DevToolsService {
  private readonly logger = new Logger(DevToolsService.name);

  constructor(@InjectDataSource() private readonly connection: DataSource) {}

  /**
   * Truncate database.
   */
  async reset() {
    this.logger.log("Truncating database.");
    await this.connection.query("TRUNCATE TABLE session, user_settings;");
  }
}
