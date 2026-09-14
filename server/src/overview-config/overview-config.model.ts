import { Column, Entity, PrimaryColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: "user_overview_config" })
export class OverviewConfig {
  @PrimaryColumn({ update: false })
  employeeNumber: number;

  @Column({ type: "jsonb" })
  config: Record<string, unknown>;

  @UpdateDateColumn({ type: "timestamptz" })
  updatedAt: Date;
}
