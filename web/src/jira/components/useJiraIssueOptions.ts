import { useCallback, useMemo } from "react";

import { useGetIssues, useRecentIssues, useSearchIssues } from "../jiraApi";
import { chunkArray, mergePages } from "../jiraUtils";
import { jiraQueryMaxResults } from "../jiraConfig";

type UseJiraIssueOptionsProps = {
  issueKeys: string[];
  searchFilter: string;
  enabled: boolean;
};

export const useJiraIssueOptions = ({
  issueKeys,
  searchFilter,
  enabled,
}: UseJiraIssueOptionsProps) => {
  const keysToFetch = [
    ...(searchFilter
      ? issueKeys.filter((option) =>
          option.toLowerCase().trim().includes(searchFilter.toLowerCase().trim()),
        )
      : issueKeys),
  ].sort((a, b) => b.localeCompare(a, undefined, { numeric: true }));

  const {
    data: pagedIssueData,
    fetchNextPage,
    error: pageError,
    hasNextPage,
    isFetching: pageFetching,
    keysFetched,
  } = useGetIssues({
    issueKeys: keysToFetch,
    enabled: enabled,
  });

  const {
    data: searchedIssueData,
    fetchNextPage: searchFetchNext,
    error: searchError,
    hasNextPage: searchHasNext,
    isFetching: searchFetching,
  } = useSearchIssues({
    issueKeys: issueKeys,
    searchFilter: searchFilter,
    enabled: enabled && !!searchFilter,
  });

  const filteredOptions = useMemo(() => {
    const fetchedIssues = keysFetched.map((key) => {
      const issue = pagedIssueData?.pages
        .flatMap((page) => page.issues)
        .find((issue) => issue.key === key);
      if (issue) {
        return { label: issue.key, text: `${issue.key}: ${issue.fields.summary}` };
      }
      return { label: key, text: key };
    });

    return fetchedIssues;
  }, [keysFetched, pagedIssueData?.pages]);

  const searchOptions = useMemo(() => {
    const searchIssues = (searchedIssueData?.pages || [])
      .flatMap((page) => page.issues)
      .map((issue) => ({
        label: issue.key,
        text: `${issue.key}: ${issue.fields.summary}`,
      }))
      .filter(
        (opt) =>
          !filteredOptions.find((opt_) => opt_.label === opt.label) &&
          issueKeys.includes(opt.label),
      );
    return searchIssues;
  }, [filteredOptions, issueKeys, searchedIssueData?.pages]);

  const { data: recentIssueData } = useRecentIssues();
  const recentIssueOptions = (recentIssueData?.issues || [])
    .filter((issue) => issueKeys.includes(issue.key))
    .slice(0, 10)
    .map((issue) => ({
      label: issue.key,
      text: `${issue.key}: ${issue.fields.summary}`,
      type: "recent",
    }));

  const pagedOptions = mergePages(
    chunkArray(filteredOptions, jiraQueryMaxResults),
    chunkArray(searchOptions, jiraQueryMaxResults),
  ).flat();

  const options =
    pageError || searchError
      ? issueKeys.map((key) => ({ label: key, text: key }))
      : searchFilter
        ? pagedOptions
        : [...recentIssueOptions, ...pagedOptions];

  const loadMore = useCallback(async () => {
    if (hasNextPage) {
      await fetchNextPage();
    }
    if (!!searchFilter && searchHasNext) {
      await searchFetchNext();
    }
  }, [fetchNextPage, hasNextPage, searchFetchNext, searchFilter, searchHasNext]);

  return {
    options,
    loadMore,
    hasNextPage: searchHasNext || hasNextPage,
    isFetching: searchFetching || pageFetching,
    error: !!(searchError || pageError),
  };
};
