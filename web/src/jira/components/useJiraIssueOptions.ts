import { useMemo } from "react";

import { useGetIssues } from "../jiraApi";

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
  const {
    data: pagedIssueData,
    fetchNextPage,
    error: pageError,
    hasNextPage,
    isFetching: pageFetching,
  } = useGetIssues({
    issueKeys: issueKeys,
    searchFilter,
    enabled: enabled,
  });

  const filteredOptions = useMemo(() => {
    const fetchedOptions = pagedIssueData?.pages
      .flatMap((page) => page.issues)
      .map((issue) => ({
        label: issue.key,
        text: `${issue.key}: ${issue.fields.summary}`,
      }))
      .filter((option) => issueKeys.includes(option.label));

    if (!hasNextPage && fetchedOptions && fetchedOptions.length < issueKeys.length) {
      return [
        ...issueKeys
          .filter((key) => searchFilter && key.toLowerCase() === searchFilter.trim().toLowerCase())
          .map((key) => ({
            label: key,
            text: key,
          })),
        ...fetchedOptions,
        ...issueKeys
          .filter(
            (key) =>
              !fetchedOptions.some((opt) => opt.label.toLowerCase() === key.toLowerCase()) &&
              (!searchFilter ||
                (key.toLowerCase().includes(searchFilter.trim().toLowerCase()) &&
                  key.toLowerCase() !== searchFilter.trim().toLowerCase())),
          )
          .map((key) => ({
            label: key,
            text: key,
          })),
      ];
    }
    return fetchedOptions || [];
  }, [hasNextPage, issueKeys, pagedIssueData?.pages, searchFilter]);

  const options = pageError ? issueKeys.map((key) => ({ label: key, text: key })) : filteredOptions;

  return {
    options,
    loadMore: fetchNextPage,
    hasNextPage: hasNextPage,
    isFetching: pageFetching,
    error: pageError,
  };
};
