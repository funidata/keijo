import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Request } from "express";

@Injectable()
export class SessionTokenGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();
    const session = request.session;

    if (session.user?.refreshToken && session.user.accessToken) {
      return true;
    }

    return false;
  }
}
