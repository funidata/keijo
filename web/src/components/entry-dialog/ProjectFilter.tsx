import { useQuery } from "@apollo/client/react";
import { Autocomplete, Chip, FormControl, TextField } from "@mui/material";
import { useTranslation } from "react-i18next";
import { FindDimensionOptionsDocument } from "../../graphql/generated/graphql";
import useEntryFormFilters from "./useEntryFormFilters";

const ProjectFilter = () => {
  const { t } = useTranslation();
  const { filters, updateSelectedProjects } = useEntryFormFilters();

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
        value={filters.projects}
        options={projectKeys}
        onChange={(_, value) => {
          updateSelectedProjects(value);
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
