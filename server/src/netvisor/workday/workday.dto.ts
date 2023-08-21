import { Field, ObjectType } from "@nestjs/graphql";
import { Entry } from "./entry.dto";

@ObjectType()
export class Workday {
  @Field()
  date: Date;

  @Field(() => [Entry])
  entries: Entry[];
}
