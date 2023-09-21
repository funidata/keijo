import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { XMLParser, validationOptions } from "fast-xml-parser";
import { AppLogger } from "../../../logger/app-logger";

/**
 * Configuration for `fast-xml-parser` to parse responses from NV API.
 */
@Injectable()
export class XmlParserService {
  constructor(private logger: AppLogger) {}

  parse(
    xmlData: string | Buffer,
    arrayPaths: string[] = [],
    validationOptions?: boolean | Partial<validationOptions> | undefined,
  ) {
    const parser = new XMLParser(this.getOptions(arrayPaths));

    try {
      return parser.parse(xmlData, validationOptions);
    } catch (error) {
      const description = "XML parsing failed.";
      this.logger.error({ description, error });
      this.logger.audit({ description, error, xmlData });
      throw new InternalServerErrorException(description);
    }
  }

  private getOptions(arrayPaths: string[] = []) {
    return {
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
    };
  }
}
