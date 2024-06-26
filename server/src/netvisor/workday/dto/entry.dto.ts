import { Field, ObjectType, PickType, registerEnumType } from "@nestjs/graphql";
import { AcceptanceStatus } from "../enum/acceptance-status.enum";

registerEnumType(AcceptanceStatus, { name: "AcceptanceStatus" });

@ObjectType()
export class Entry {
  @Field()
  key: string;

  @Field()
  duration: number;

  @Field()
  durationInHours: boolean;

  @Field()
  description: string;

  @Field(() => AcceptanceStatus)
  acceptanceStatus: AcceptanceStatus;

  @Field()
  typeName: string;

  @Field(() => Number, { nullable: true })
  ratioNumber: number | null;

  @Field(() => String, { nullable: true })
  product: string | null;

  @Field(() => String, { nullable: true })
  activity: string | null;

  @Field(() => String, { nullable: true })
  issue: string | null;

  @Field(() => String, { nullable: true })
  client: string | null;
}

export class EntryDimensions extends PickType(Entry, ["product", "activity", "issue", "client"]) {}
