import { XMLParser } from "fast-xml-parser";

/**
 * Configuration for `fast-xml-parser` to parse responses from NV API.
 */
export class NetvisorXmlParser extends XMLParser {
  constructor(arrayPaths: string[]) {
    super({
      isArray: (_, path) => {
        return arrayPaths.includes(path);
      },
      tagValueProcessor: (_, tagValue) => {
        // Change decimal separator from comma to period because the parser does not support comma.
        if (typeof tagValue === "string" && tagValue.match(/^\d{1,2},\d{1,2}$/g)) {
          return tagValue.replace(",", ".");
        }
        return tagValue;
      },
    });

    return this;
  }
}
