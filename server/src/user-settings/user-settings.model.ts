import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class UserSettings {
  @PrimaryColumn()
  employeeNumber: number;

  @Column({ nullable: true })
  productPreset: string;

  @Column({ nullable: true })
  activityPreset: string;
}
