export const jqlAND = (jqlFirst: string, jqlSecond: string) => `(${jqlFirst}) AND (${jqlSecond})`;

export const jqlOR = (jqlFirst: string, jqlSecond: string) => `(${jqlFirst}) OR (${jqlSecond})`;

export const jqlOrderBy = (jql: string, field: string, order: "DESC" | "ASC" = "DESC") =>
  `${jql} ORDER BY ${field} ${order}`;

export const keyIsInKeys = (issueKeys: string[]) =>
  `key in (${issueKeys.map((key) => `'${key}'`).join(", ")})`;

export const summaryContains = (searchFilter: string) => `summary ~ '${searchFilter.trim()}*'`;

export const jqlRecentIssues = () =>
  "issuekey in issueHistory() OR assignee = currentUser() OR reporter = currentUser()";
