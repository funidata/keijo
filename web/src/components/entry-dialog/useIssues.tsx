import { JiraIssue, useAllIssues, useRecentIssues } from "../../jira/jiraApi";

type UseIssues = {
  recent: JiraIssue[];
  rest: JiraIssue[];
};

/**
 * Issue data from Netvisor, possibly enriched with details from Jira.
 */
const useIssues = (): UseIssues => {
  const recent = useRecentIssues();
  const rest = useAllIssues();

  return {
    recent,
    // TODO: `rest` must fall back on `nvIssueKeys` if Jira fetching fails or takes long.
    rest,
  };
};

export default useIssues;
