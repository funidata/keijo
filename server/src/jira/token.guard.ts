import { Injectable, ExecutionContext, CanActivate, UnauthorizedException } from "@nestjs/common";
import { Request } from "express";
import { SessionPartialTokens } from "./jira.types";

@Injectable()
export class tokenGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    const req: Request = context.switchToHttp().getRequest();
    const session: SessionPartialTokens = req.session;
    if (!session.user || !session.user.refreshToken || !session.user.accessToken)
      throw new UnauthorizedException();
    return true;
  }
}
