export type JiraTokens = { refreshToken: string; accessToken: string };
export interface JiraUser {
  user?: JiraTokens;
}

declare module "express-session" {
  interface SessionData extends JiraUser {}
}
declare module "express" {
  export interface Request extends JiraUser {}
}
