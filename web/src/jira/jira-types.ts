export type JiraIssue = {
  id: string;
  key: string;
  self: string;
  expand: string;
  fields: {
    summary: string;
  };
};

export type JiraIssueResult = {
  issues: JiraIssue[];
  nextPageToken: string;
  isLast: boolean;
};
