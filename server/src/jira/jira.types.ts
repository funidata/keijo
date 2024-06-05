import { Session, SessionData } from "express-session";

export type Tokens = { user: { refreshToken: string; accessToken: string } };
export type SessionPartialTokens = Session & Partial<SessionData & Tokens>;
export type RequestWithTokens = Request & Tokens;
export type SessionWithTokens = Session & SessionData & Tokens;
