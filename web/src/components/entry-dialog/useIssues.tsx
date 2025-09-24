import { useQuery } from "@apollo/client";
import { FindDimensionOptionsDocument } from "../../graphql/generated/graphql";
import { JiraIssue, useAllIssues, useRecentIssues } from "../../jira/jiraApi";

type UseIssues = {
  recent: JiraIssue[];
  rest: JiraIssue[];
};

/**
 * Issue data from Netvisor, possibly enriched with details from Jira.
 */
const useIssues = (): UseIssues => {
  const { data: dimensionData } = useQuery(FindDimensionOptionsDocument);
  const nvIssueKeys = dimensionData?.findDimensionOptions.issue || [];
  const recent = useRecentIssues();
  // console.info("recent", recent);
  const rest = useAllIssues();

  return {
    recent,
    // TODO: `rest` must fall back on `nvIssueKeys` if Jira fetching fails or takes long.
    rest,
  };
};

export default useIssues;
