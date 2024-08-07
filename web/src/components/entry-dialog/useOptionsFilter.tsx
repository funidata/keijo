import { useCallback } from "react";
import { GetMySettingsDocument } from "../../graphql/generated/graphql";
import { useQuery } from "@apollo/client";

const useOptionsFilter = <T,>(getLabel: (option: T) => string) => {
  const { data: settingsData } = useQuery(GetMySettingsDocument);

  const filterOptions = useCallback(
    (options: T[]) => {
      const projectsFilter = settingsData?.getMySettings.projectsPreset;
      if (projectsFilter && projectsFilter.length) {
        return options.filter((option: T) =>
          projectsFilter.some((project) => getLabel(option).includes(project)),
        );
      }
      return options;
    },
    [getLabel, settingsData?.getMySettings.projectsPreset],
  );

  return filterOptions;
};

export default useOptionsFilter;
