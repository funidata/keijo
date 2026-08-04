import { Exception } from "./Exception";

export class OldWeekParamFormatException extends Exception {
  constructor() {
    super("errors.oldWeekParamFormat");
  }
}
