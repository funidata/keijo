import { Autocomplete, ListItem, TextField } from "@mui/material";
import { FieldValues, UseFormReturn } from "react-hook-form";
import { FindDimensionOptionsDocument } from "../../graphql/generated/graphql";
import { useGetIssues, useSearchIssues } from "../../jira/jiraApi";
import { issueKeyToSummary } from "../../jira/jiraUtils";
import { jiraQueryMaxResults } from "../../jira/jiraConfig";
import useInfiniteScroll from "react-infinite-scroll-hook";
import { useDebounceValue } from "usehooks-ts";
import { useQuery } from "@apollo/client";

type JiraIssueFieldProps<T extends FieldValues> = {
  form: UseFormReturn<T>;
  title: string;
  options: Array<string>;
  value: unknown;
  onChange: (val: unknown) => void;
};

const JiraIssueAutoComplete = <T extends FieldValues>({
  form,
  title,
  options,
  value,
  onChange,
}: JiraIssueFieldProps<T>) => {
  const { loading } = useQuery(FindDimensionOptionsDocument);

  const [issueFilter, setIssueFilter] = useDebounceValue("", 300);
  const {
    data: dataPages,
    error,
    fetchNextPage,
    hasNextPage,
    isLoading: pagesLoading,
  } = useGetIssues({ issueKeys: options, enabled: !loading });

  const { data: searchedIssueData, isLoading: searchLoading } = useSearchIssues({
    issueKeys: options,
    searchFilter: issueFilter,
  });

  const [sentryRef, { rootRef }] = useInfiniteScroll({
    loading: pagesLoading,
    hasNextPage,
    disabled: !!error,
    onLoadMore: fetchNextPage,
    delayInMs: 0,
  });

  const pagedIssueData = dataPages?.pages;
  const queriedKeys = [
    ...(pagedIssueData || []),
    ...(searchedIssueData ? [searchedIssueData] : []),
  ];
  const keyToSummary = issueKeyToSummary(queriedKeys);
  const queriedOptions = [
    ...new Set([
      ...options.slice(0, (dataPages?.pages.length || 1) * jiraQueryMaxResults),
      ...Object.keys(keyToSummary),
    ]),
  ];
  const getOptionText = (option: string) =>
    keyToSummary[option] ? `${option}: ${keyToSummary[option]}` : option;

  return (
    <Autocomplete
      value={value}
      loading={pagesLoading || searchLoading}
      onChange={(_, value) => onChange(value)}
      options={queriedOptions}
      renderOption={(props, option, state) => {
        const shouldLoadMore = (state.index + 1) % jiraQueryMaxResults === 0 && state.index > 0;
        return (
          <ListItem {...props} ref={shouldLoadMore ? sentryRef : undefined}>
            {getOptionText(option as string)}
          </ListItem>
        );
      }}
      filterOptions={(options, state) => {
        if ((state.inputValue && state.inputValue !== issueFilter) || searchLoading) return [];
        return options.filter((option) =>
          getOptionText(option as string)
            .toLowerCase()
            .trim()
            .includes(state.inputValue.toLowerCase().trim()),
        );
      }}
      ListboxProps={{
        ref: rootRef,
      }}
      onInputChange={(_, value, reason) => {
        if (reason === "input") setIssueFilter(value);
      }}
      autoHighlight
      renderInput={(params) => (
        <TextField
          {...params}
          label={title}
          onChange={onChange}
          error={!!form.formState.errors["issue"]}
          helperText={form.formState.errors["issue"]?.message as string}
        />
      )}
    />
  );
};

export default JiraIssueAutoComplete;
