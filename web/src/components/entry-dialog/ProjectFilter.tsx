import { useQuery } from "@apollo/client/react";
import Autocomplete from "@mui/material/Autocomplete";
import Chip from "@mui/material/Chip";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import FormHelperText from "@mui/material/FormHelperText";
import { useTranslation } from "react-i18next";
import { FindDimensionOptionsDocument } from "../../graphql/generated/graphql";

interface ProjectFilterProps {
  selectedProjects: string[];
  onProjectsChange?: (projects: string[]) => void;
}

const helperId = "project-filter-helper-text";

export default function ProjectFilter({ selectedProjects, onProjectsChange }: ProjectFilterProps) {
  const { t } = useTranslation();
  const { data } = useQuery(FindDimensionOptionsDocument);
  const issueKeys = data?.findDimensionOptions.issue || [];
  const projectKeys = [
    ...new Set(
      issueKeys.filter((key) => /^[A-Za-z]+-\d+$/.test(key)).map((key) => key.split("-")[0]),
    ),
  ];

  return (
    <FormControl fullWidth>
      <Autocomplete
        value={selectedProjects}
        options={projectKeys}
        onChange={(_, value) => {
          onProjectsChange?.(value);
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
        aria-describedby={helperId}
      />
      <FormHelperText id={helperId}>{t("entryDialog.filterProjectsHelperText")}</FormHelperText>
    </FormControl>
  );
}
