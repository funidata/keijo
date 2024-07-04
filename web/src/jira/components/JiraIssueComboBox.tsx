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

  const nvKeys = useMemo(
    () => data?.findDimensionOptions[name] || [],
    [data?.findDimensionOptions, name],
  );
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
  } = useSearchIssues({
    issueKeys: nvKeys,
    searchFilter: searchFilter,
  });

  const filteredOptions = useMemo(() => {
    const keysFetched = filteredKeys.slice(
      0,
      (pagedIssueData?.pageParams.slice(-1)[0] || 0) + jiraQueryMaxResults,
    );

    const fetchedIssues = keysFetched.map((key) => {
      const issue = pagedIssueData?.pages
        .flatMap((page) => page.issues)
        .find((issue) => issue.key === key);
      if (issue) return { label: issue.key, text: `${issue.key}: ${issue.fields.summary}` };
      return { label: key, text: key };
    });

    return fetchedIssues;
  }, [filteredKeys, pagedIssueData?.pageParams, pagedIssueData?.pages]);

  const searchOptions = useMemo(() => {
    const searchIssues = (searchedIssueData?.pages || [])
      .flatMap((page) => page.issues)
      .map((issue) => ({
        label: issue.key,
        text: `${issue.key}: ${issue.fields.summary}`,
      }))
      .filter(
        (opt) =>
          !filteredOptions.find((opt_) => opt_.label === opt.label) && nvKeys.includes(opt.label),
      );
    return searchIssues;
  }, [filteredOptions, nvKeys, searchedIssueData?.pages]);

  const pagedOptions = mergePages(
    chunkArray(filteredOptions, jiraQueryMaxResults),
    chunkArray(searchOptions, jiraQueryMaxResults),
  ).flat();

  const options =
    pageError || searchError ? nvKeys.map((key) => ({ label: key, text: key })) : pagedOptions;

  const [sentryRef, { rootRef }] = useInfiniteScroll({
    loading: searchFetching || pageFetching,
    hasNextPage: hasNextPage || searchHasNext,
    disabled: !!pageError || !!searchError,
    onLoadMore: async () => {
      if (hasNextPage) await fetchNextPage();
      if (!!searchFilter && searchHasNext) await searchFetchNext();
    },
    delayInMs: 0,
    rootMargin: `0px 0px ${10 * pagedOptions.length}px 0px`,
  });

  useEffect(() => {
    setDebouncePending(false);
  }, [searchFilter]);

  return (
    <DimensionComboBox
      {...params}
      name={name}
      autoCompleteProps={{
        options: options,
        renderOption: (props, option, state) => {
          const maxIndex = options.length - 1;
          const shouldLoadMore = !pageFetching && !searchFetching && state.index === maxIndex;
          if (option.type === "loader")
            return (
              <ListItem {...props}>
                <Typography color="GrayText">{option.text}</Typography>
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
                  ? [...options, { label: "Loading", type: "loader", text: "Loading..." }]
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
