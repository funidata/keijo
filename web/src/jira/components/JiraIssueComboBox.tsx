import { ListItem, ListItemText, Typography } from "@mui/material";
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

  const [optionFilter, setOptionFilter] = useState("");
  const [searchFilter, setSearchFilter] = useDebounceValue("", 500);

  const [debounceLoading, setDebounceLoading] = useState(false);
  const [keyToSummary, setKeyToSummary] = useState<Record<string, string>>({});

  const getOptionText = (option: string) =>
    keyToSummary[option] ? `${option}: ${keyToSummary[option]}` : option;

  const getOptions = (issueKeys: Array<string>) =>
    issueKeys.map((option) => ({
      label: option,
      text: getOptionText(option),
      type: "option",
    }));

  const nvKeys = data?.findDimensionOptions[name] || [];
  const filteredKeys = searchFilter
    ? nvKeys.filter((option) =>
        option.toLowerCase().trim().includes(searchFilter.toLowerCase().trim()),
      )
    : nvKeys;

  const {
    data: pagedIssueData,
    fetchNextPage,
    error: pageError,
    hasNextPage,
    isFetching: pageFetching,
  } = useGetIssues({ issueKeys: filteredKeys, enabled: !loading });

  const {
    data: searchedIssueData,
    fetchNextPage: searchFetchNext,
    error: searchError,
    hasNextPage: searchHasNext,
    isFetching: searchFetching,
  } = useSearchIssues({
    issueKeys: nvKeys,
    searchFilter: searchFilter,
  });

  const [pagesSeen, setPagesSeen] = useState(1);
  const filteredOptions = getOptions(
    nvKeys.filter((option) =>
      getOptionText(option).toLowerCase().trim().includes(optionFilter.toLowerCase().trim()),
    ),
  );

  // If something from oneloadmore does not bring more results to the list, infinite scroll will go crazy.
  const [sentryRef, { rootRef }] = useInfiniteScroll({
    loading: searchFetching || pageFetching,
    hasNextPage:
      hasNextPage || searchHasNext || pagesSeen * jiraQueryMaxResults < filteredOptions.length,
    disabled: !!pageError || !!searchError,
    onLoadMore: async () => {
      if (pagesSeen * jiraQueryMaxResults < filteredOptions.length)
        setPagesSeen((prev) => prev + 1);
      if (hasNextPage) await fetchNextPage();
      if (!!searchFilter && searchHasNext) await searchFetchNext();
    },
  });

  useEffect(() => {
    const queriedKeys = [...(pagedIssueData?.pages || []), ...(searchedIssueData?.pages || [])];
    setKeyToSummary((prev) => ({ ...prev, ...issueKeyToSummary(queriedKeys) }));
    const pagesLoaded = Math.max(
      searchedIssueData?.pages.length || 1,
      pagedIssueData?.pages.length || 1,
    );

    setPagesSeen(pagesLoaded);
  }, [pagedIssueData?.pages, searchedIssueData?.pages]);

  useEffect(() => {
    if (searchFilter) setDebounceLoading(false);
  }, [searchFilter]);

  return (
    <DimensionComboBox
      {...params}
      name={name}
      autoCompleteProps={{
        options: getOptions(nvKeys),
        renderOption: (props, option, state) => {
          const error = pageError || searchError;
          const maxIndex = error ? filteredOptions.length : pagesSeen * jiraQueryMaxResults - 1;
          const shouldLoadMore = !pageFetching && !searchFetching && state.index === maxIndex;
          if (option.type === "loader")
            return (
              <ListItem {...props}>
                <Typography color="GrayText">{option.label}</Typography>
              </ListItem>
            );
          if (state.index > maxIndex) return null;
          return (
            <ListItem
              {...props}
              style={{ overflowWrap: "break-word" }}
              ref={shouldLoadMore ? sentryRef : undefined}
            >
              <ListItemText>{option.text}</ListItemText>
              &nbsp;
              {!keyToSummary[option.label] &&
                (searchFetching || pageFetching || debounceLoading) && (
                  <Typography color="GrayText">...</Typography>
                )}
            </ListItem>
          );
        },
        filterOptions: () => {
          const addLoadingOption = searchFetching || debounceLoading || pageFetching;
          return addLoadingOption
            ? [...filteredOptions, { label: "Loading...", type: "loader", text: "" }]
            : filteredOptions;
        },
        ListboxProps: {
          ref: rootRef,
        },
        onInputChange: (_, value, reason) => {
          if (["input", "clear"].includes(reason)) {
            setDebounceLoading(true);
            setOptionFilter(value);
            setSearchFilter(value);
          }
          if (!value || value === searchFilter) setDebounceLoading(false);
        },
      }}
    />
  );
};

export default JiraIssueComboBox;
