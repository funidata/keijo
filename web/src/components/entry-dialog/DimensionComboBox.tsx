import { useQuery } from "@apollo/client";
import { Autocomplete, FormControl, Grid, TextField } from "@mui/material";
import { Control, Controller, ControllerProps, FieldValues, UseFormReturn } from "react-hook-form";
import { FindDimensionOptionsDocument } from "../../graphql/generated/graphql";
import JiraIssueAutoComplete from "../../jira/components/JiraIssueAutoComplete";
import { useIsJiraAuthenticated } from "../../jira/jiraApi";

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
  const { data } = useQuery(FindDimensionOptionsDocument);
  const options = data?.findDimensionOptions[name] || [];

  const { isJiraAuth } = useIsJiraAuthenticated();
  return (
    <Grid item xs={12} md={6}>
      <FormControl fullWidth>
        <Controller
          control={form.control as unknown as Control<FieldValues>}
          name={name}
          rules={rules}
          render={({ field: { value, onChange } }) => {
            if (name === "issue" && isJiraAuth)
              return (
                <JiraIssueAutoComplete
                  form={form}
                  value={value}
                  onChange={onChange}
                  title={title}
                  options={options}
                />
              );
            return (
              <Autocomplete
                value={value || null}
                onChange={(_, value) => onChange(value)}
                options={options}
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
