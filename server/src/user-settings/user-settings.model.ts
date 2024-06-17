import { Field, ObjectType } from "@nestjs/graphql";
import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
@ObjectType()
export class UserSettings {
  @PrimaryColumn()
  @Field()
  employeeNumber: number;

  @Column({ nullable: true })
  @Field({ nullable: true })
  productPreset: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  activityPreset: string;
}
