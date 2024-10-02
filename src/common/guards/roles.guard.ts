import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { UserRole } from '../enums/UserRole';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Retrieve the roles required for this route
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      // If no roles are specified, allow access
      return true;
    }

    // Extract the user from the request
    const { user } = context.switchToHttp().getRequest();


    console.log(user);

    if (!user) {
      // If there's no user in the request, deny access
      return false;
    }

    // Check if the user has any of the required roles
    return requiredRoles.some((role) => user.role === role);
  }
}
