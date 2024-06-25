import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Request } from "express";
import { SessionData } from "express-session";

export const SessionUser = createParamDecorator((_, ctx: ExecutionContext) => {
  const request: Request = ctx.switchToHttp().getRequest();
  const session: SessionData = request.session;
  return session.user;
});

export const ReqUser = createParamDecorator((_, ctx: ExecutionContext) => {
  const request: Request = ctx.switchToHttp().getRequest();
  return request.user;
});
