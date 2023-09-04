import { array, number, object, string, z as zod } from "zod";
import { rootSchema } from "./root.schema";

export const dimensionListNvSchema = rootSchema.extend({
  DimensionNameList: object({
    DimensionName: array(
      object({
        Netvisorkey: number(),
        Name: string(),
        IsHidden: string(),
        LinkType: number(),
        DimensionDetails: object({
          DimensionDetail: array(
            object({
              Netvisorkey: number(),
              Name: string(),
              IsHidden: string(),
              Level: number(),
              Sort: number(),
              EndSort: number(),
              FatherID: number(),
            }),
          ),
        }),
      }),
    ),
  }),
});

export type DimensionListNvSchema = zod.infer<typeof dimensionListNvSchema>;
