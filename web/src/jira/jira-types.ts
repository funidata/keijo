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

export type JiraProject = {
  id: string;
  key: string;
  self: string;
  expand: string;
  name: string;
  projectTypeKey: string;
  isPrivate: boolean;
};

export type JiraProjectResult = {
  maxResults: number;
  startAt: number;
  total: number;
  isLast: boolean;
  values: JiraProject[];
};
