import { useQuery } from "@apollo/client";
import { DimensionOptions, FindDimensionOptionsDocument } from "../graphql/generated/graphql";

/**
 * Dimension data from backend.
 *
 * Guarantees the resulting `DimensionOptions` shape and returns empty lists as values by default.
 */
export const useDimensionOptions = (): DimensionOptions => {
  const { data } = useQuery(FindDimensionOptionsDocument);

  return (
    data?.findDimensionOptions || {
      activity: [],
      client: [],
      issue: [],
      product: [],
    }
  );
};
