import { useMutation, useQuery } from "@apollo/client";
import { Autocomplete, Chip, FormControl, TextField } from "@mui/material";
import { useTranslation } from "react-i18next";
import {
  FindDimensionOptionsDocument,
  GetMySettingsDocument,
  UpdateSettingsDocument,
} from "../../graphql/generated/graphql";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

const ProjectFilter = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { data: settingsData } = useQuery(GetMySettingsDocument);
  const [updateSettings] = useMutation(UpdateSettingsDocument, {
    refetchQueries: [GetMySettingsDocument],
  });

  useEffect(() => {
    queryClient.clear();
  }, [queryClient, settingsData?.getMySettings.projectsPreset]);

  const { data } = useQuery(FindDimensionOptionsDocument);
  const issueKeys = data?.findDimensionOptions.issue || [];

  const projects = [...new Set(issueKeys.map((key) => key.split("-")[0]))];

  return (
    <FormControl fullWidth>
      <Autocomplete
        value={settingsData?.getMySettings.projectsPreset || []}
        options={projects}
        onChange={(_, value) =>
          updateSettings({ variables: { settings: { projectsPreset: value } } })
        }
        renderTags={(value, getTagProps) => {
          const numTags = value.length;
          const limitTags = 1;
          return (
            <>
              {value.slice(0, limitTags).map((option, index) => (
                <Chip {...getTagProps({ index })} key={index} label={option} />
              ))}

              {numTags > limitTags && ` +${numTags - limitTags}`}
            </>
          );
        }}
        multiple
        renderInput={(params) => <TextField {...params} label={t("entryDialog.filterProjects")} />}
      />
    </FormControl>
  );
};

export default ProjectFilter;
