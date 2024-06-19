import { ListItem, Typography } from "@mui/material";
import { ControllerProps, FieldValues, UseFormReturn } from "react-hook-form";
import { FindDimensionOptionsDocument } from "../../graphql/generated/graphql";
import { useQuery } from "@apollo/client";
import useInfiniteScroll from "react-infinite-scroll-hook";
import DimensionComboBox from "../../components/entry-dialog/DimensionComboBox";
import { useDebounceValue } from "usehooks-ts";
import { useGetIssues, useSearchIssues } from "../jiraApi";
import { issueKeyToSummary } from "../jiraUtils";
import { jiraQueryMaxResults } from "../jiraConfig";
import { useEffect, useState } from "react";

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
  const [debounceLoading, setDebounceLoading] = useState(false);

  const [keyToSummary, setKeyToSummary] = useState<Record<string, string>>({});
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

  useEffect(() => {
    const queriedKeys = [
      ...(dataPages?.pages || []),
      ...(searchedIssueData ? [searchedIssueData] : []),
    ];
    setKeyToSummary((prev) => ({ ...prev, ...issueKeyToSummary(queriedKeys) }));
  }, [dataPages?.pages, searchedIssueData]);

  useEffect(() => {
    if (issueFilter) setDebounceLoading(false);
  }, [issueFilter]);

  const getOptionText = (option: string) =>
    keyToSummary[option] ? `${option}: ${keyToSummary[option]}` : option;

  return (
    <DimensionComboBox
      {...params}
      name={name}
      autoCompleteProps={{
        options: options.map((text) => ({ label: text, type: "option" })),
        renderOption: (props, option, state) => {
          const maxIndex = (dataPages?.pageParams.length || 1) * jiraQueryMaxResults - 1;
          const shouldLoadMore = (state.index + 1) % jiraQueryMaxResults === 0 && state.index > 0;
          if (option.type === "loader")
            return (
              <ListItem>
                <Typography color="GrayText">{option.label}</Typography>
              </ListItem>
            );
          if (state.index > maxIndex) return null;
          return (
            <ListItem {...props} ref={shouldLoadMore ? sentryRef : undefined}>
              {getOptionText(option.label)}
              &nbsp;
              {!keyToSummary[option.label] && (searchLoading || debounceLoading) && (
                <Typography color="GrayText">...</Typography>
              )}
            </ListItem>
          );
        },
        filterOptions: (options, state) => {
          const filtered = options.filter((option) =>
            getOptionText(option.label)
              .toLowerCase()
              .trim()
              .includes(state.inputValue.toLowerCase().trim()),
          );
          if (searchLoading || debounceLoading || pagesLoading)
            filtered.push({ label: "Loading...", type: "loader" });
          return filtered;
        },
        ListboxProps: {
          ref: rootRef,
        },
        onInputChange: (_, value, reason) => {
          if (reason === "input") {
            setDebounceLoading(true);
            setIssueFilter(value);
          }
          if (!value || value === issueFilter) setDebounceLoading(false);
        },
      }}
    />
  );
};

export default JiraIssueComboBox;
