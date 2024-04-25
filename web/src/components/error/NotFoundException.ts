import { Exception } from "./Exception";

export class NotFoundException extends Exception {
  constructor() {
    super("errors.notFound");
  }
}
