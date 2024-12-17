import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_VERIFIED_KEY } from 'src/auth/decorators/isverified.decorator'; // import key

@Injectable()
export class IsVerifiedGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Retrieve the metadata using the correct key
    const requiredVerification = this.reflector.get<boolean>(
      IS_VERIFIED_KEY,
      context.getHandler(),
    );

    const user = context.switchToHttp().getRequest().user;

    // Ensure the user exists and has the `isVerified` property
    if (!user || typeof user.isVerified !== 'boolean')
      throw new ForbiddenException('you are not verified !');

    // Check if the user's `isVerified` status matches the required status
    if (user.isVerified != requiredVerification)
      throw new ForbiddenException('you are not verified !');

    return true;
  }
}
