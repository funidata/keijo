import { Injectable, ExecutionContext, CanActivate, UnauthorizedException } from "@nestjs/common";
import { Request } from "express";
import { SessionData } from "express-session";

@Injectable()
export class SessionTokenGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    const req: Request = context.switchToHttp().getRequest();
    const session: SessionData = req.session;
    if (!session.user || !session.user.refreshToken || !session.user.accessToken)
      throw new UnauthorizedException();
    return true;
  }
}
