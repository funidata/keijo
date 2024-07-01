import { ListItem, ListItemText, Typography } from "@mui/material";
import { ControllerProps, FieldValues, UseFormReturn } from "react-hook-form";
import { FindDimensionOptionsDocument } from "../../graphql/generated/graphql";
import { useQuery } from "@apollo/client";
import useInfiniteScroll from "react-infinite-scroll-hook";
import DimensionComboBox from "../../components/entry-dialog/DimensionComboBox";
import { useDebounceValue } from "usehooks-ts";
import { useGetIssues, useSearchIssues } from "../jiraApi";
import { chunkArray, mergePages } from "../jiraUtils";
import { jiraQueryMaxResults } from "../jiraConfig";
import { useEffect, useMemo, useState } from "react";

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

  const [searchFilter, setSearchFilter] = useDebounceValue("", 300);
  const [debouncePending, setDebouncePending] = useState(false);

  const nvKeys = data?.findDimensionOptions[name] || [];
  const filteredKeys = [
    ...(searchFilter
      ? nvKeys.filter((option) =>
          option.toLowerCase().trim().includes(searchFilter.toLowerCase().trim()),
        )
      : nvKeys),
  ].sort((a, b) => b.localeCompare(a, undefined, { numeric: true }));

  const {
    data: pagedIssueData,
    fetchNextPage,
    error: pageError,
    hasNextPage,
    isFetching: pageFetching,
    issueData,
    keysFetched,
  } = useGetIssues({
    issueKeys: filteredKeys,
    enabled: !loading,
  });

  const {
    data: searchedIssueData,
    fetchNextPage: searchFetchNext,
    error: searchError,
    hasNextPage: searchHasNext,
    isFetching: searchFetching,
    issueData: searchData,
  } = useSearchIssues({
    issueKeys: nvKeys,
    searchFilter: searchFilter,
  });

  const filteredOptions = useMemo(() => {
    const fetchedIssues = keysFetched.map((key) => {
      const issue = issueData.find((issue) => issue.key === key);
      if (issue) return { label: issue.key, text: `${issue.key}: ${issue.summary}` };
      return { label: key, text: key };
    });

    const searchIssues = searchData
      .map((issue) => ({
        label: issue.key,
        text: `${issue.key}: ${issue.summary}`,
      }))
      .filter(
        (opt) =>
          !fetchedIssues.find((opt_) => opt_.label === opt.label) && nvKeys.includes(opt.label),
      );

    const combinedPages = mergePages(
      chunkArray(fetchedIssues, jiraQueryMaxResults),
      chunkArray(searchIssues, jiraQueryMaxResults),
    );
    return combinedPages.flat();
  }, [searchedIssueData, pagedIssueData]);

  const [sentryRef, { rootRef }] = useInfiniteScroll({
    loading: searchFetching || pageFetching,
    hasNextPage: hasNextPage || searchHasNext,
    disabled: !!pageError || !!searchError,
    onLoadMore: async () => {
      if (hasNextPage) await fetchNextPage();
      if (!!searchFilter && searchHasNext) await searchFetchNext();
    },
    delayInMs: 0,
    rootMargin: `0px 0px ${10 * filteredOptions.length}px 0px`,
  });

  useEffect(() => {
    setDebouncePending(false);
  }, [searchFilter]);

  return (
    <DimensionComboBox
      {...params}
      name={name}
      autoCompleteProps={{
        options:
          pageError || searchError
            ? nvKeys.map((key) => ({ label: key, text: key }))
            : filteredOptions,
        renderOption: (props, option, state) => {
          const maxIndex = filteredOptions.length - 1;
          const shouldLoadMore = !pageFetching && !searchFetching && state.index === maxIndex;
          if (option.type === "loader")
            return (
              <ListItem {...props}>
                <Typography color="GrayText">{option.label}</Typography>
              </ListItem>
            );
          return (
            <ListItem
              {...props}
              style={{ overflowWrap: "break-word" }}
              ref={shouldLoadMore ? sentryRef : undefined}
            >
              <ListItemText>{option.text}</ListItemText>
              &nbsp;
              {option.label === option.text &&
                (searchFetching || pageFetching || debouncePending) && (
                  <Typography color="GrayText">...</Typography>
                )}
            </ListItem>
          );
        },
        filterOptions:
          pageError || searchError
            ? undefined
            : (options) => {
                const addLoadingOption = searchFetching || debouncePending || pageFetching;
                return addLoadingOption
                  ? [...options, { label: "Loading...", type: "loader", text: "" }]
                  : options;
              },
        ListboxProps: {
          ref: rootRef,
        },
        onInputChange: (_, value, reason) => {
          if (["input", "clear"].includes(reason)) {
            setDebouncePending(true);
            setSearchFilter(value);
          }
        },
      }}
    />
  );
};

export default JiraIssueComboBox;
