import { useContainer, validate } from "class-validator";
import { Test } from "@nestjs/testing";
import { AppLogger } from "../../../logger/app-logger";
import { DimensionConstraint } from "../../dimension/dimension.constraint";
import { DimensionService } from "../../dimension/dimension.service";
import { AddWorkdayEntryInput } from "./add-workday-entry-input.dto";

describe("AddWorkdayEntryInput", () => {
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        DimensionConstraint,
        {
          provide: DimensionService,
          useValue: {
            findDimensionOptions: jest.fn().mockResolvedValue({
              product: [],
              activity: [],
              issue: [],
              client: [],
            }),
          },
        },
        {
          provide: AppLogger,
          useValue: {
            setContext: jest.fn(),
            error: jest.fn(),
          },
        },
      ],
    }).compile();

    useContainer(module, { fallbackOnErrors: true });
  });

  it("should use the custom message when the issue is not valid Netvisor dimension value", async () => {
    const input = Object.assign(new AddWorkdayEntryInput(), {
      date: new Date(),
      duration: 1,
      description: "",
      product: null,
      activity: null,
      issue: "DELETED-123",
      client: null,
    });

    const errors = await validate(input);

    expect(errors).toHaveLength(1);
    expect(errors[0]).toMatchObject({
      property: "issue",
      constraints: {
        DimensionConstraint: "Selected issue is no longer available.",
      },
    });
  });
});
