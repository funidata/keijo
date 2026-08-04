export type JiraTokens = { refreshToken: string; accessToken: string };

declare module "express-session" {
  interface SessionData {
    user?: JiraTokens;
  }
}

declare module "express" {
  export interface Request {
    user?: JiraTokens;
  }
}
