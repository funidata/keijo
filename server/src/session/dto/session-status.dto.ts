import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class SessionStatus {
  @Field(() => Number, { nullable: true })
  employeeNumber: number | null;
}
