import { ListItem } from "@mui/material";
import { ControllerProps, FieldValues, UseFormReturn } from "react-hook-form";
import { FindDimensionOptionsDocument } from "../../graphql/generated/graphql";
import { useQuery } from "@apollo/client";
import useInfiniteScroll from "react-infinite-scroll-hook";
import DimensionComboBox from "../../components/entry-dialog/DimensionComboBox";
import { useDebounceValue } from "usehooks-ts";
import { useGetIssues, useSearchIssues } from "../jiraApi";
import { issueKeyToSummary } from "../jiraUtils";
import { jiraQueryMaxResults } from "../jiraConfig";

type JiraIssueComboBoxProps<T extends FieldValues> = {
  form: UseFormReturn<T>;
  name: "issue";
  title: string;
  rules?: ControllerProps["rules"];
};

const JiraIssueComboBox = <T extends FieldValues>({
  name,
  ...params
}: JiraIssueComboBoxProps<T>) => {
  const { data, loading } = useQuery(FindDimensionOptionsDocument);
  const options = data?.findDimensionOptions[name] || [];

  const [issueFilter, setIssueFilter] = useDebounceValue("", 500);
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

  const getOptionText = (option: string) =>
    keyToSummary[option] ? `${option}: ${keyToSummary[option]}` : option;

  return (
    <DimensionComboBox
      {...params}
      name={name}
      autoCompleteProps={{
        options: options,
        renderOption: (props, option, state) => {
          const shouldLoadMore = (state.index + 1) % jiraQueryMaxResults === 0 && state.index > 0;
          if (state.index + 1 > (dataPages?.pageParams.length || 1) * jiraQueryMaxResults)
            return null;
          return (
            <ListItem {...props} ref={shouldLoadMore ? sentryRef : undefined}>
              {getOptionText(option as string)}

              {!keyToSummary[option] && searchLoading && " ..."}
            </ListItem>
          );
        },
        filterOptions: (options, state) => {
          const filtered = options.filter((option) =>
            getOptionText(option as string)
              .toLowerCase()
              .trim()
              .includes(state.inputValue.toLowerCase().trim()),
          );
          return filtered;
        },
        ListboxProps: {
          ref: rootRef,
        },
        onInputChange: (_, value, reason) => {
          if (reason === "input") {
            setIssueFilter(value);
          }
        },
      }}
    />
  );
};

export default JiraIssueComboBox;
