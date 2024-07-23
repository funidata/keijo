import { Field, ObjectType } from "@nestjs/graphql";
import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity({ name: "user_settings" })
@ObjectType()
export class UserSettings {
  @PrimaryColumn({ update: false })
  @Field()
  employeeNumber: number;

  @Column({ nullable: true })
  @Field({ nullable: true })
  productPreset: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  activityPreset: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  showWeekend: boolean;

  @Column({ nullable: true })
  @Field({ nullable: true })
  setRemainingHours: boolean;
}
