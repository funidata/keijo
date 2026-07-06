/**
 * Escape string for safe use in JQL queries.
 *
 * The result is intended to be used only as a string in JQL. The escaping done here may not be
 * sufficient for use as another part of a query.
 *
 * The result is wrapped in double quotes.
 */
export const escapeUserInputForJql = (input: string): string => {
  const escaped = input
    // Backslash is the escape character, so escape it first.
    .replace(/\\/g, "\\\\")
    // Escape double quotes.
    .replace(/"/g, '\\"');

  // Wrap the result in double quotes so we don't have to worry about singles, etc.
  return `"${escaped}"`;
};

export const keyIsInKeys = (issueKeys: string[]) =>
  `key in (${issueKeys.map((key) => `'${key}'`).join(", ")})`;
