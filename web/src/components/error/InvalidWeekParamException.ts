import { Exception } from "./Exception";

export class InvalidWeekParamException extends Exception {
  constructor() {
    super("errors.invalidWeekParam");
  }
}
