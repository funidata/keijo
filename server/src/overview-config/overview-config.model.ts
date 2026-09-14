import { Column, Entity, PrimaryColumn, UpdateDateColumn } from "typeorm";
import type { OverviewZone } from "./dto/overview-config.dto";

@Entity({ name: "user_overview_config" })
export class OverviewConfig {
  @PrimaryColumn({ update: false })
  employeeNumber: number;

  @Column({ type: "jsonb" })
  config: OverviewZone[];

  @UpdateDateColumn({ type: "timestamptz" })
  updatedAt: Date;
}
