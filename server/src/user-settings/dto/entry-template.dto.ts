import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { IsDimensionValue } from "../../netvisor/dimension/is-dimension-value.decorator";

@InputType()
export class EntryTemplateInput {
  @Field()
  duration: number;

  @Field()
  description: string;

  @IsDimensionValue()
  @Field(() => String, { nullable: true })
  product: string | null;

  @IsDimensionValue()
  @Field(() => String, { nullable: true })
  activity: string | null;

  @IsDimensionValue()
  @Field(() => String, { nullable: true })
  issue: string | null;

  @IsDimensionValue()
  @Field(() => String, { nullable: true })
  client: string | null;
}

@ObjectType()
export class EntryTemplateType {
  @Field()
  key: number;

  @Field()
  duration: number;

  @Field()
  description: string;

  @IsDimensionValue()
  @Field(() => String, { nullable: true })
  product: string | null;

  @IsDimensionValue()
  @Field(() => String, { nullable: true })
  activity: string | null;

  @IsDimensionValue()
  @Field(() => String, { nullable: true })
  issue: string | null;

  @IsDimensionValue()
  @Field(() => String, { nullable: true })
  client: string | null;
}
