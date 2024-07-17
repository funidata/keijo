import { useQuery } from "@apollo/client";
import { ListItem, ListItemText, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { ControllerProps, FieldValues, UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import useInfiniteScroll from "react-infinite-scroll-hook";
import { useDebounceValue } from "usehooks-ts";
import DimensionComboBox from "../../components/entry-dialog/DimensionComboBox";
import { useNotificationState } from "../../components/global-notification/useNotification";
import { FindDimensionOptionsDocument } from "../../graphql/generated/graphql";
import { useJiraIssueOptions } from "./useJiraIssueOptions";

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
  const { t } = useTranslation();
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("md"));

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
    disabled: error,
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
        groupBy: searchFilter
          ? undefined
          : (option) => {
              if (option.type === "recent") {
                return t("jira.issueGroups.recent");
              }
              return t("jira.issueGroups.all");
            },
        ListboxProps: {
          ref: rootRef,
        },
        onInputChange: (_, value, reason) => {
          if ((reason === "reset" && value) || value === searchFilter) {
            return;
          }
          setDebouncePending(true);
          setSearchFilter(value);
        },
        componentsProps: !mobile
          ? {
              popper: {
                style: {
                  width: "45vw",
                  maxWidth: "580px",
                },

                placement: "bottom-start",
              },
            }
          : undefined,
      }}
    />
  );
};

export default JiraIssueComboBox;
