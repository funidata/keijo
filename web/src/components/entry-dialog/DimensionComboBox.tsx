import { useQuery } from "@apollo/client";
import { Autocomplete, FormControl, Grid, ListItem, TextField } from "@mui/material";
import { Control, Controller, ControllerProps, FieldValues, UseFormReturn } from "react-hook-form";
import { FindDimensionOptionsDocument } from "../../graphql/generated/graphql";
import { useGetIssues } from "../../jira/jiraApi";
import { issueKeyToSummary } from "../../jira/jiraUtils";
import { jiraQueryMaxResults } from "../../jira/jiraConfig";
import useInfiniteScroll from "react-infinite-scroll-hook";

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
  const {
    data: dataPages,
    error,
    fetchNextPage,
    hasNextPage,
    isLoading,
  } = useGetIssues(options, issuesEnabled);

  const [sentryRef, { rootRef }] = useInfiniteScroll({
    loading: isLoading,
    hasNextPage,
    disabled: !!error,
    onLoadMore: fetchNextPage,
    delayInMs: 0,
  });

  const issueData = dataPages?.pages;
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
                  const optionInd = options.indexOf(option);
                  const shouldLoadMore = optionInd % jiraQueryMaxResults === 0 && optionInd > 0;
                  return (
                    <ListItem {...props} ref={shouldLoadMore ? sentryRef : undefined}>
                      {getOptionText(option)}
                    </ListItem>
                  );
                }}
                filterOptions={(options, state) => {
                  return options.filter((option) =>
                    getOptionText(option)
                      .toLowerCase()
                      .trim()
                      .includes(state.inputValue.toLowerCase().trim()),
                  );
                }}
                ListboxProps={{
                  ref: rootRef,
                }}
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
