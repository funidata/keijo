import { useApolloClient, useMutation, useQuery } from "@apollo/client/react";
import { Autocomplete, Chip, FormControl, TextField } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FindDimensionOptionsDocument,
  GetMySettingsDocument,
  UpdateSettingsDocument,
} from "../../graphql/generated/graphql";

const ProjectFilter = () => {
  const { t } = useTranslation();
  const client = useApolloClient();
  const { data: settingsData } = useQuery(GetMySettingsDocument);
  const [updateSettings] = useMutation(UpdateSettingsDocument, {
    refetchQueries: [GetMySettingsDocument],
  });

  const serverPreset = settingsData?.getMySettings.projectsPreset;
  const [selected, setSelected] = useState<string[]>([]);
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current && serverPreset !== undefined) {
      initialized.current = true;
      setSelected(serverPreset ?? []);
    }
  }, [serverPreset]);

  const { data } = useQuery(FindDimensionOptionsDocument);
  const issueKeys = data?.findDimensionOptions.issue || [];
  const projects = [...new Set(issueKeys.map((key) => key.split("-")[0]))];

  return (
    <FormControl fullWidth>
      <Autocomplete
        value={selected}
        options={projects}
        onChange={(_, value) => {
          setSelected(value);
          const existing = client.readQuery({ query: GetMySettingsDocument });
          if (existing) {
            client.writeQuery({
              query: GetMySettingsDocument,
              data: { getMySettings: { ...existing.getMySettings, projectsPreset: value } },
            });
          }
          updateSettings({ variables: { settings: { projectsPreset: value } } });
        }}
        renderValue={(value, getTagProps) => {
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
