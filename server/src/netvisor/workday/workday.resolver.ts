import { Query, Resolver } from "@nestjs/graphql";
import { Workday } from "./workday.model";

@Resolver()
export class WorkdayResolver {
  @Query(() => Workday)
  test() {
    return null;
  }
}
