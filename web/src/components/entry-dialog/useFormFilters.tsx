import { GetMySettingsDocument } from "../../graphql/generated/graphql";
import { useQuery } from "@apollo/client";

const useFormFilters = () => {
  const { data: settingsData } = useQuery(GetMySettingsDocument);

  const numOfFilters = [!!settingsData?.getMySettings.projectsPreset?.length].filter(
    (value) => value,
  ).length;

  const hasFilters = numOfFilters > 0;

  return { hasFilters, numOfFilters };
};

export default useFormFilters;
