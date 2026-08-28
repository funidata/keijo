import { Field, ObjectType } from "@nestjs/graphql";
import { Column, Entity, PrimaryColumn } from "typeorm";
import { EntryTemplateType } from "./dto/entry-template.dto";

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

  @Column({ type: "varchar", array: true, nullable: true })
  @Field(() => [String], { nullable: true })
  projectsPreset: string[];

  @Column({ nullable: true })
  @Field({ nullable: true })
  jiraNotificationIgnore: boolean;

  @Column({ nullable: true })
  @Field({ nullable: true })
  showWeekend: boolean;

  @Column({ nullable: true })
  @Field({ nullable: true })
  setRemainingHours: boolean;

  @Column({ nullable: true })
  @Field({ nullable: true })
  showJiraIssueStatus: boolean;

  @Column("simple-json", { nullable: true })
  @Field(() => [EntryTemplateType], { nullable: true })
  entryTemplates: EntryTemplateType[];
}
