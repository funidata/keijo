import { ListItem, ListItemText, Typography } from "@mui/material";
import { ControllerProps, FieldValues, UseFormReturn } from "react-hook-form";
import { FindDimensionOptionsDocument } from "../../graphql/generated/graphql";
import { useQuery } from "@apollo/client";
import useInfiniteScroll from "react-infinite-scroll-hook";
import DimensionComboBox from "../../components/entry-dialog/DimensionComboBox";
import { useDebounceValue } from "usehooks-ts";
import { useEffect, useState } from "react";
import { useJiraIssueOptions } from "./useJiraIssueOptions";
import { useNotificationState } from "../../components/global-notification/useNotification";
import { useQueryClient } from "@tanstack/react-query";

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
  const queryClient = useQueryClient();

  const nvKeys = data?.findDimensionOptions[name] || [];

  const [searchFilter, setSearchFilter] = useDebounceValue("", 400);
  const [debouncePending, setDebouncePending] = useState(false);

  const { options, loadMore, hasNextPage, isFetching, error } = useJiraIssueOptions({
    issueKeys: nvKeys,
    searchFilter,
    enabled: !loading,
  });

  const [sentryRef, { rootRef }] = useInfiniteScroll({
    loading: isFetching,
    hasNextPage: hasNextPage,
    disabled: !!error,
    onLoadMore: loadMore,
    delayInMs: 0,
    rootMargin: `0px 0px 1500px 0px`,
  });

  useEffect(() => {
    setDebouncePending(false);
  }, [searchFilter]);

  if (error) {
    queryClient.invalidateQueries({ queryKey: ["accessToken"] });
    useNotificationState.getState().setNotification({
      message:
        "Could not fetch issues from Jira. You might need to reconnect to Jira from settings. Falling back to default options.",
      type: "error",
      autoHide: false,
    });
    return <DimensionComboBox form={params.form} name="issue" title={params.title} />;
  }
  return (
    <DimensionComboBox
      {...params}
      name={name}
      autoCompleteProps={{
        options: options,
        renderOption: (props, option, state) => {
          const shouldLoadMore = !isFetching && state.index === options.length - 1;
          if (option.type === "loader") {
            return (
              <ListItem {...props}>
                <Typography color="GrayText">{option.text}</Typography>
              </ListItem>
            );
          }
          return (
            <ListItem
              {...props}
              style={{ overflowWrap: "break-word" }}
              ref={shouldLoadMore ? sentryRef : undefined}
            >
              <ListItemText>{option.text}</ListItemText>
              &nbsp;
              {option.label === option.text && (isFetching || debouncePending) && (
                <Typography color="GrayText">...</Typography>
              )}
            </ListItem>
          );
        },
        filterOptions: (options) => {
          const addLoadingOption = isFetching || debouncePending;
          return addLoadingOption
            ? [...options, { label: "Loading", type: "loader", text: "Loading..." }]
            : options;
        },
        ListboxProps: {
          ref: rootRef,
        },
        onInputChange: (_, value, reason) => {
          if (reason === "reset" && value) {
            return;
          }
          setDebouncePending(true);
          setSearchFilter(value);
        },
      }}
    />
  );
};

export default JiraIssueComboBox;
