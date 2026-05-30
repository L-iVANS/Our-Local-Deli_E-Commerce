import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export const ROLES_KEY = 'roles';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>(
      ROLES_KEY,
      context.getHandler(),
    );
    if (!requiredRoles) {
      return true;
    }

    const request = this.getRequest(context);
    const user = request?.user;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    const hasRole = requiredRoles.includes(user.role);
    if (!hasRole) {
      throw new ForbiddenException(
        `Access denied. Required roles: ${requiredRoles.join(', ')}`,
      );
    }

    return true;
  }

  private getRequest(context: ExecutionContext): any {
    const httpRequest = context.switchToHttp().getRequest();
    if (httpRequest) {
      return httpRequest;
    }

    const gqlContext = context.getArgByIndex(2);
    return gqlContext?.req ?? null;
  }
}

export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
