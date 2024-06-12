import { useQuery } from "@apollo/client";
import { Autocomplete, FormControl, Grid, TextField } from "@mui/material";
import { Control, Controller, ControllerProps, FieldValues, UseFormReturn } from "react-hook-form";
import { FindDimensionOptionsDocument } from "../../graphql/generated/graphql";
import { useGetIssues } from "../../jira/jiraApi";
import { issueKeyToSummary } from "../../jira/jiraUtils";

type DimensionComboBoxProps<T extends FieldValues> = {
  form: UseFormReturn<T>;
  name: "product" | "activity" | "issue" | "client";
  title: string;
  rules?: ControllerProps["rules"];
};

const DimensionComboBox = <T extends FieldValues>({
  form,
  name,
  title,
  rules,
}: DimensionComboBoxProps<T>) => {
  const { data, loading } = useQuery(FindDimensionOptionsDocument);
  const options = data?.findDimensionOptions[name] || [];

  const issuesEnabled = name === "issue" && !loading;
  const { data: issueData } = useGetIssues(options, issuesEnabled);
  const keyToSummary = issueData ? issueKeyToSummary(issueData) : {};
  const getOptionText = (option: string) =>
    keyToSummary[option] ? `${option}: ${keyToSummary[option]}` : option;

  return (
    <Grid item xs={12} md={6}>
      <FormControl fullWidth>
        <Controller
          control={form.control as unknown as Control<FieldValues>}
          name={name}
          rules={rules}
          render={({ field: { value, onChange } }) => {
            return (
              <Autocomplete
                value={value || null}
                onChange={(_, value) => onChange(value)}
                options={options}
                renderOption={(props, option) => {
                  return <li {...props}>{getOptionText(option)}</li>;
                }}
                filterOptions={(options, state) =>
                  options.filter((option) =>
                    getOptionText(option)
                      .toLowerCase()
                      .trim()
                      .includes(state.inputValue.toLowerCase().trim()),
                  )
                }
                autoHighlight
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={title}
                    onChange={onChange}
                    error={!!form.formState.errors[name]}
                    helperText={form.formState.errors[name]?.message as string}
                  />
                )}
              />
            );
          }}
        />
      </FormControl>
    </Grid>
  );
};

export default DimensionComboBox;
