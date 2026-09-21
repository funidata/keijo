import { Field, InputType, ObjectType, registerEnumType } from "@nestjs/graphql";
import { Type } from "class-transformer";
import { IsArray, IsEnum, ValidateNested } from "class-validator";

export enum OverviewGraphType {
  Totals = "totals",
  Timeline = "timeline",
}

export enum OverviewGraphVariant {
  BarVertical = "barVertical",
  BarHorizontal = "barHorizontal",
  Pie = "pie",
  Stacked = "stacked",
  Unstacked = "unstacked",
}

export enum OverviewGroupBy {
  Product = "product",
  Activity = "activity",
  Issue = "issue",
  Client = "client",
}

registerEnumType(OverviewGraphType, { name: "OverviewGraphType" });
registerEnumType(OverviewGraphVariant, { name: "OverviewGraphVariant" });
registerEnumType(OverviewGroupBy, { name: "OverviewGroupBy" });

@ObjectType()
export class OverviewGraph {
  @Field(() => OverviewGraphType)
  type: OverviewGraphType;

  @Field(() => OverviewGraphVariant)
  variant: OverviewGraphVariant;
}

@ObjectType()
export class OverviewZone {
  @Field(() => OverviewGroupBy)
  groupBy: OverviewGroupBy;

  @Field(() => [OverviewGraph])
  graphs: OverviewGraph[];
}

@InputType()
export class OverviewGraphInput {
  @Field(() => OverviewGraphType)
  @IsEnum(OverviewGraphType)
  type: OverviewGraphType;

  @Field(() => OverviewGraphVariant)
  @IsEnum(OverviewGraphVariant)
  variant: OverviewGraphVariant;
}

@InputType()
export class OverviewZoneInput {
  @Field(() => OverviewGroupBy)
  @IsEnum(OverviewGroupBy)
  groupBy: OverviewGroupBy;

  @Field(() => [OverviewGraphInput])
  @Type(() => OverviewGraphInput)
  @IsArray()
  @ValidateNested({ each: true })
  graphs: OverviewGraphInput[];
}
