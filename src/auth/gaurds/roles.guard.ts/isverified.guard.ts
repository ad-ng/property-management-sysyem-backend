import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { IsVerifiedKey } from "src/auth/decorators/isverified.decorator";

@Injectable()
export class IsVerfiedGuard implements CanActivate{
    constructor(private reflector: Reflector){}

    canActivate(context: ExecutionContext): boolean {
        const requiredVerification = this.reflector.get<boolean>(IsVerifiedKey, context.getHandler())
        if (!requiredVerification) {
      return false;
    }
    const user = context.switchToHttp().getRequest().user;

    // Ensure the user exists and has the `isVerified` property
    if (!user || typeof user.isVerified !== 'boolean') {
      return false;
    }

    // Check if the user's `isVerified` status matches the required status
    return user.isVerified === requiredVerification;
    }
}