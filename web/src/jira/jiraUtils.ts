import { JiraIssueResults } from "./jiraApi";

export const issueKeyToSummary = (
  issueData: JiraIssueResults | undefined,
): Record<string, string> =>
  (issueData || [])
    .flatMap((x) => x.issues)
    .reduce((a, b) => ({ ...a, [b.key]: b.fields.summary }), {});
