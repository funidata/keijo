import { JiraIssueResults } from "./jiraApi";

export const issueKeyToSummary = (issueData: JiraIssueResults): Record<string, string> =>
  (issueData || [])
    .flatMap((x) => x.issues)
    .reduce((a, b) => ({ ...a, [b.key]: b.fields.summary }), {});

export const mergePages = <T>(...arrays: T[][][]): T[][] => {
  const maxLength = Math.max(...arrays.map((arr) => arr.length));
  return Array.from({ length: maxLength }, (_, i) => {
    return arrays.reduce((acc: T[], array) => {
      return acc.concat(array[i] || []);
    }, []);
  });
};

export const chunkArray = <T>(array: T[], size: number) => {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    const chunk = array.slice(i, i + size);
    result.push(chunk);
  }
  return result;
};
