import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { XMLParser, validationOptions } from "fast-xml-parser";
import { Logger } from "../../../logger/logger";

/**
 * Configuration for `fast-xml-parser` to parse responses from NV API.
 */
@Injectable()
export class XmlParserService {
  constructor(private logger: Logger) {
    logger.setContext(XmlParserService.name);
  }

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
      this.logger.error(`${description} [${error.message}]`);
      this.logger.audit({
        message: description,
        errors: [error.message],
        xml: xmlData.toString(),
      });
      throw new InternalServerErrorException(description);
    }
  }

  private getOptions(arrayPaths: string[] = []) {
    return {
      ignoreAttributes: false,
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
