import { Autocomplete, AutocompleteProps, ListItem } from "@mui/material";
import { FindDimensionOptionsDocument } from "../../graphql/generated/graphql";
import { useGetIssues, useSearchIssues } from "../../jira/jiraApi";
import { issueKeyToSummary } from "../../jira/jiraUtils";
import { jiraQueryMaxResults } from "../../jira/jiraConfig";
import useInfiniteScroll from "react-infinite-scroll-hook";
import { useDebounceValue } from "usehooks-ts";
import { useQuery } from "@apollo/client";

type JiraIssueFieldProps = AutocompleteProps<
  string,
  boolean | undefined,
  boolean | undefined,
  boolean | undefined
> & {
  options: Array<string>;
};

const JiraIssueAutoComplete = ({ options, ...params }: JiraIssueFieldProps) => {
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
      {...params}
      loading={pagesLoading || searchLoading}
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
        const filtered = options.filter((option) =>
          getOptionText(option as string)
            .toLowerCase()
            .trim()
            .includes(state.inputValue.toLowerCase().trim()),
        );
        if (filtered.length === 0) setIssueFilter(state.inputValue.toLowerCase().trim());
        return filtered;
      }}
      ListboxProps={{
        ref: rootRef,
      }}
    />
  );
};

export default JiraIssueAutoComplete;
