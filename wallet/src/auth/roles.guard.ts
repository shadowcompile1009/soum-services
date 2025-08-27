import { mixin } from '@nestjs/common';
import { Injectable, CanActivate, ExecutionContext, Inject, Logger } from '@nestjs/common';
import { AuthzService } from '@src/modules/authz/authz.service';
import { memoize } from '@src/utils/memoize.util';

interface Type<T = any> extends Function {
  new (...args: any[]): T;
}

export const RolesGuard: (allowedRoles: string | string[]) => CanActivate =
  memoize(rolesGuard);

function rolesGuard(allowedRoles: string | string[]): Type<CanActivate> {
  @Injectable()
  class RolesMixin implements CanActivate {
    constructor(private readonly authzService: AuthzService) {
      if (!allowedRoles || allowedRoles.length === 0) {
        new Logger('RolesGuard').error('Please provide role name');
      }
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
      const { user } = context.switchToHttp().getRequest();
      if (!user?.roleId) {
        return false;
      }
      const roleObj = await this.authzService.getRole({
        id: user.roleId,
      });
      if (roleObj.canAccessAll) {
        return true;
      }
      if (allowedRoles.includes(roleObj?.name)) {
        return true;
      }
      return false;
    }
  }

  const guard = mixin(RolesMixin);
  return guard;
}
