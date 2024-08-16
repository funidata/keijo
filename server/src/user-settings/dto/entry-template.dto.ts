import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { IsDimensionValue } from "../../netvisor/dimension/is-dimension-value.decorator";
import { IsNumberString } from "class-validator";

@ObjectType({ isAbstract: true })
@InputType({ isAbstract: true })
class EntryTemplate {
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

@InputType()
export class EntryTemplateInput extends EntryTemplate {}

@ObjectType()
export class EntryTemplateType extends EntryTemplate {
  @IsNumberString()
  @Field()
  key: string;
}

@InputType()
export class RemoveEntryTemplateInput {
  @Field()
  @IsNumberString()
  key: string;
}
