import { Field, InputType, ObjectType, registerEnumType } from "@nestjs/graphql";

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
  type: OverviewGraphType;

  @Field(() => OverviewGraphVariant)
  variant: OverviewGraphVariant;
}

@InputType()
export class OverviewZoneInput {
  @Field(() => OverviewGroupBy)
  groupBy: OverviewGroupBy;

  @Field(() => [OverviewGraphInput])
  graphs: OverviewGraphInput[];
}
