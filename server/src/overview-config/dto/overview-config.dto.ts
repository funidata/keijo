import { Field, ObjectType, registerEnumType } from "@nestjs/graphql";

export enum OverviewGraphType {
  Totals = "totals",
  Timeline = "timeline",
}

export enum OverviewGroupBy {
  Product = "product",
  Activity = "activity",
  Issue = "issue",
  Client = "client",
}

registerEnumType(OverviewGraphType, { name: "OverviewGraphType" });
registerEnumType(OverviewGroupBy, { name: "OverviewGroupBy" });

@ObjectType()
export class OverviewGraph {
  @Field(() => OverviewGraphType)
  type: OverviewGraphType;

  @Field()
  variant: string;
}

@ObjectType()
export class OverviewZone {
  @Field(() => OverviewGroupBy)
  groupBy: OverviewGroupBy;

  @Field(() => [OverviewGraph])
  graphs: OverviewGraph[];
}
