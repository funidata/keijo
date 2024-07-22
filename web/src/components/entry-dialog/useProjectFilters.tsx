import { useQuery } from "@apollo/client";
import { useTranslation } from "react-i18next";
import { FindDimensionOptionsDocument } from "../../graphql/generated/graphql";

type UseProjectFiltersProps = {
  name: string;
};

const useProjectFilters = () => {
  const { data } = useQuery(FindDimensionOptionsDocument);
  const issueKeys = data?.findDimensionOptions.issue || [];

  const projects = [...new Set(...issueKeys.map((key) => key.split("-")[0]))];

  return { projects };
};

export default useProjectFilters;
